import { randomInt } from "node:crypto";
import { MODELES } from "@/data/modeles";
import { notifierAgence } from "@/lib/notify";
import { limiteAtteinte } from "@/lib/rate-limit";
import { supabaseServeur } from "@/lib/supabase";
import { demandeSchema, erreursParChamp, type DemandeValidee } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TAILLE_MAX = 20_000;
// Sans caractères ambigus (0/O, 1/I) pour pouvoir dicter le numéro par téléphone.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function genererNumero(): string {
  const d = new Date();
  const aamm = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  let suffixe = "";
  for (let i = 0; i < 4; i++) suffixe += ALPHABET[randomInt(ALPHABET.length)];
  return `PC-${aamm}-${suffixe}`;
}

function reponse(corps: Record<string, unknown>, status = 200) {
  return Response.json(corps, { status, headers: { "Cache-Control": "no-store" } });
}

function adresseIp(request: Request): string {
  const transmise = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return transmise || request.headers.get("x-real-ip") || "inconnue";
}

export async function POST(request: Request) {
  if (limiteAtteinte(adresseIp(request))) {
    return reponse({ ok: false, message: "Trop de demandes envoyées. Réessayez dans quelques minutes." }, 429);
  }

  const brut = await request.text();
  if (brut.length > TAILLE_MAX) {
    return reponse({ ok: false, message: "La demande est trop volumineuse." }, 413);
  }

  let json: unknown;
  try {
    json = JSON.parse(brut);
  } catch {
    return reponse({ ok: false, message: "Demande illisible." }, 400);
  }

  const analyse = demandeSchema.safeParse(json);
  if (!analyse.success) {
    return reponse({ ok: false, message: "Certains champs sont à corriger.", errors: erreursParChamp(analyse.error) }, 422);
  }
  const demande = analyse.data;

  // Robot détecté : on répond comme si tout allait bien, sans rien enregistrer.
  if (demande.website) {
    return reponse({ ok: true, numDem: genererNumero() });
  }

  const db = supabaseServeur();
  if (!db) {
    console.error("Supabase non configuré : SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant.");
    return reponse({ ok: false, unavailable: true, message: "L’envoi en ligne est momentanément indisponible." }, 503);
  }

  try {
    const numDem = await enregistrer(db, demande);
    await notifierAgence(numDem, demande);
    return reponse({ ok: true, numDem });
  } catch (e) {
    console.error("Enregistrement de la demande impossible", e);
    return reponse({ ok: false, message: "Votre demande n’a pas pu être enregistrée. Réessayez ou écrivez-nous sur WhatsApp." }, 500);
  }
}

type Db = NonNullable<ReturnType<typeof supabaseServeur>>;

async function enregistrer(db: Db, d: DemandeValidee): Promise<string> {
  // 1. Client : retrouvé par son numéro, jamais modifié (évite qu'un tiers change l'identité d'un client existant).
  let idClie: number | undefined;
  const existant = await db.from("client").select("id_clie").eq("cont_clie", d.contact).maybeSingle();
  if (existant.error) throw existant.error;
  idClie = existant.data?.id_clie;

  if (idClie === undefined) {
    const cree = await db
      .from("client")
      .insert({ nom_clie: d.nom, pren_clie: d.prenom, cont_clie: d.contact, email_clie: d.email ?? null })
      .select("id_clie")
      .single();
    if (cree.error?.code === "23505") {
      const relu = await db.from("client").select("id_clie").eq("cont_clie", d.contact).single();
      if (relu.error) throw relu.error;
      idClie = relu.data.id_clie;
    } else if (cree.error) {
      throw cree.error;
    } else {
      idClie = cree.data.id_clie;
    }
  }

  // 2. Demande : le numéro est aléatoire ; en cas de collision (très improbable) on retente.
  let numDem = "";
  for (let essai = 0; essai < 4; essai++) {
    numDem = genererNumero();
    const { error } = await db.from("demande").insert({
      num_dem: numDem,
      id_clie: idClie,
      type_support: d.typeSupport,
      format_dem: d.format ?? null,
      style_dem: d.style ?? null,
      description_dem: d.description,
      delai_souhaite: d.delai ?? null,
    });
    if (!error) break;
    if (error.code !== "23505" || essai === 3) throw error;
  }

  // 3. Relation « inspirer » : les modèles choisis sont enregistrés dans la table modele s'ils n'y sont pas encore.
  if (d.modeles.length > 0) {
    const lignes = MODELES.filter((m) => d.modeles.includes(m.slug)).map((m) => ({
      slug: m.slug,
      nom_mod: m.nom,
      categorie: m.categorie,
    }));
    const modeles = await db.from("modele").upsert(lignes, { onConflict: "slug" }).select("id_mod");
    if (modeles.error) throw modeles.error;
    const liens = await db
      .from("inspirer")
      .insert(modeles.data.map((m) => ({ num_dem: numDem, id_mod: m.id_mod })));
    if (liens.error) throw liens.error;
  }

  return numDem;
}
