import type { Metadata } from "next";
import { seDeconnecter } from "./actions";
import { ConnexionInfographe } from "./connexion";
import { sessionInfographeValide } from "@/lib/infographe-auth";
import { supabaseServeur } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Espace infographe",
  robots: { index: false, follow: false },
};

type DemandeInfographe = {
  num_dem: string;
  stat_dem: "recue" | "transmise" | "en_cours" | "terminee" | "annulee";
  date_dem: string;
  created_at: string;
  type_support: string;
  format_dem: string | null;
  style_dem: string | null;
  description_dem: string;
  delai_souhaite: string | null;
  client: {
    nom_clie: string;
    pren_clie: string;
    cont_clie: string;
    email_clie: string | null;
  } | null;
  inspirer: { modele: { nom_mod: string; slug: string } | null }[];
};

const STATUTS: Record<DemandeInfographe["stat_dem"], string> = {
  recue: "Reçue",
  transmise: "Transmise",
  en_cours: "En cours",
  terminee: "Terminée",
  annulee: "Annulée",
};

function dateFrancaise(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date));
}

export default async function InfographePage() {
  if (!(await sessionInfographeValide())) {
    return <ConnexionInfographe />;
  }

  const db = supabaseServeur();
  if (!db) {
    return (
      <main className="container-x py-16">
        <p role="alert" className="rounded-lg border border-corail/30 bg-white p-6">
          La base de données n’est pas configurée. L’administrateur doit renseigner les identifiants Supabase du serveur.
        </p>
      </main>
    );
  }

  const { data: demandes, error } = await db
    .from("demande")
    .select(
      `num_dem, stat_dem, date_dem, created_at, type_support, format_dem,
       style_dem, description_dem, delai_souhaite,
       client (nom_clie, pren_clie, cont_clie, email_clie),
       inspirer (modele (nom_mod, slug))`,
    )
    .returns<DemandeInfographe[]>()
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Chargement des demandes pour l’infographe impossible.", error.message);
    return (
      <main className="container-x py-16">
        <p role="alert" className="rounded-lg border border-corail/30 bg-white p-6">
          Impossible de charger les demandes. Vérifiez la connexion à Supabase ou réessayez plus tard.
        </p>
      </main>
    );
  }

  return (
    <main className="container-x py-10 md:py-16">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-bleu">Espace sécurisé</p>
          <h1 className="h2 mt-2">Demandes de création</h1>
          <p className="mt-2 text-muted">
            {demandes.length} {demandes.length > 1 ? "demandes reçues" : "demande reçue"}
          </p>
        </div>
        <form action={seDeconnecter}>
          <button type="submit" className="btn-secondary">Se déconnecter</button>
        </form>
      </header>

      {demandes.length === 0 ? (
        <p className="mt-10 rounded-lg border border-line bg-white p-6 text-muted">
          Aucune demande n’a encore été reçue.
        </p>
      ) : (
        <ul className="mt-8 space-y-5">
          {demandes.map((demande) => (
            <li key={demande.num_dem}>
              <article className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-7">
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <h2 className="h3">{demande.num_dem}</h2>
                    <p className="mt-1 text-sm text-muted">
                      Reçue le {dateFrancaise(demande.created_at)}
                    </p>
                  </div>
                  <span className="rounded-full bg-bleu/10 px-3 py-1 text-sm font-semibold text-bleu">
                    {STATUTS[demande.stat_dem]}
                  </span>
                </header>

                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  <section aria-label="Coordonnées du client">
                    <h3 className="font-semibold">Client</h3>
                    {demande.client ? (
                      <div className="mt-2 space-y-1 text-sm">
                        <p>{demande.client.pren_clie} {demande.client.nom_clie}</p>
                        <p><a className="link" href={`tel:${demande.client.cont_clie}`}>{demande.client.cont_clie}</a></p>
                        {demande.client.email_clie && (
                          <p><a className="link break-all" href={`mailto:${demande.client.email_clie}`}>{demande.client.email_clie}</a></p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted">Fiche client introuvable pour cette demande.</p>
                    )}
                  </section>

                  <section aria-label="Détails de la création">
                    <h3 className="font-semibold">Création demandée</h3>
                    <dl className="mt-2 space-y-1 text-sm">
                      <div><dt className="inline font-medium">Support : </dt><dd className="inline">{demande.type_support}</dd></div>
                      {demande.format_dem && <div><dt className="inline font-medium">Format : </dt><dd className="inline">{demande.format_dem}</dd></div>}
                      {demande.style_dem && <div><dt className="inline font-medium">Style : </dt><dd className="inline">{demande.style_dem}</dd></div>}
                      {demande.delai_souhaite && <div><dt className="inline font-medium">Délai souhaité : </dt><dd className="inline">{dateFrancaise(demande.delai_souhaite)}</dd></div>}
                    </dl>
                  </section>
                </div>

                <section className="mt-5">
                  <h3 className="font-semibold">Description</h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm">{demande.description_dem}</p>
                </section>

                {demande.inspirer.length > 0 && (
                  <section className="mt-5">
                    <h3 className="font-semibold">Modèles d’inspiration</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {demande.inspirer.map(({ modele }) => modele && (
                        <li key={modele.slug} className="rounded-full bg-paper px-3 py-1 text-sm">
                          {modele.nom_mod}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}