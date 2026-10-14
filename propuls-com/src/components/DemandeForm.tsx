"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SUPPORTS } from "@/data/categories";
import { MODELES, modeleParSlug } from "@/data/modeles";
import { demandeSchema, erreursParChamp } from "@/lib/validation";

type Valeurs = {
  prenom: string;
  nom: string;
  contact: string;
  email: string;
  typeSupport: string;
  format: string;
  style: string;
  description: string;
  delai: string;
};

const VIDE: Valeurs = { prenom: "", nom: "", contact: "", email: "", typeSupport: "", format: "", style: "", description: "", delai: "" };
const ORDRE = ["prenom", "nom", "contact", "email", "typeSupport", "format", "style", "description", "delai", "modeles"];

type Etat =
  | { phase: "saisie" }
  | { phase: "envoi" }
  | { phase: "ok"; numDem: string }
  | { phase: "erreur"; message: string; indisponible: boolean };

function Champ({
  id,
  label,
  aide,
  erreur,
  facultatif,
  children,
}: {
  id: string;
  label: string;
  aide?: string;
  erreur?: string;
  facultatif?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold">
        {label}
        {facultatif && <span className="ml-2 font-normal text-muted">facultatif</span>}
      </label>
      {children}
      {aide && !erreur && (
        <p id={`${id}-aide`} className="mt-1.5 text-sm text-muted">
          {aide}
        </p>
      )}
      {erreur && (
        <p id={`${id}-erreur`} className="mt-1.5 text-sm font-medium text-[#B3351D]">
          {erreur}
        </p>
      )}
    </div>
  );
}

export function DemandeForm({ whatsapp, whatsappSuccesBase }: { whatsapp: string | null; whatsappSuccesBase: string | null }) {
  const params = useSearchParams();
  const [valeurs, setValeurs] = useState<Valeurs>(VIDE);
  const [modeles, setModeles] = useState<string[]>([]);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [etat, setEtat] = useState<Etat>({ phase: "saisie" });
  const piege = useRef<HTMLInputElement>(null);
  const titreSucces = useRef<HTMLHeadingElement>(null);

  // Modèles choisis sur la page « Modèles » (?modeles=a,b).
  useEffect(() => {
    const brut = params.get("modeles");
    if (!brut) return;
    const valides = brut
      .split(",")
      .map((s) => s.trim())
      .filter((s, i, tous) => tous.indexOf(s) === i && modeleParSlug(s))
      .slice(0, 5);
    setModeles(valides);
  }, [params]);

  useEffect(() => {
    if (etat.phase === "ok") titreSucces.current?.focus();
  }, [etat.phase]);

  const maj = (champ: keyof Valeurs) => (e: { target: { value: string } }) => {
    setValeurs((v) => ({ ...v, [champ]: e.target.value }));
    if (erreurs[champ]) setErreurs((er) => ({ ...er, [champ]: "" }));
  };

  const propsChamp = (id: keyof Valeurs, aide = false) => ({
    id,
    name: id,
    value: valeurs[id],
    onChange: maj(id),
    "aria-invalid": erreurs[id] ? (true as const) : undefined,
    "aria-describedby": erreurs[id] ? `${id}-erreur` : aide ? `${id}-aide` : undefined,
    className: "field",
  });

  const retirer = (slug: string) => setModeles((m) => m.filter((s) => s !== slug));

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etat.phase === "envoi") return;

    const charge = { ...valeurs, modeles, website: piege.current?.value ?? "" };
    const analyse = demandeSchema.safeParse(charge);
    if (!analyse.success) {
      const errs = erreursParChamp(analyse.error);
      setErreurs(errs);
      const premier = ORDRE.find((c) => errs[c]);
      if (premier) document.getElementById(premier)?.focus();
      return;
    }

    setErreurs({});
    setEtat({ phase: "envoi" });
    try {
      const res = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(charge),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        numDem?: string;
        message?: string;
        errors?: Record<string, string>;
        unavailable?: boolean;
      };

      if (res.ok && data.ok && data.numDem) {
        setEtat({ phase: "ok", numDem: data.numDem });
        return;
      }
      if (res.status === 422 && data.errors) {
        setErreurs(data.errors);
        setEtat({ phase: "saisie" });
        const premier = ORDRE.find((c) => data.errors?.[c]);
        if (premier) document.getElementById(premier)?.focus();
        return;
      }
      setEtat({ phase: "erreur", message: data.message ?? "Une erreur est survenue.", indisponible: Boolean(data.unavailable) });
    } catch {
      setEtat({ phase: "erreur", message: "Connexion impossible. Vérifiez votre réseau et réessayez.", indisponible: false });
    }
  }

  if (etat.phase === "ok") {
    const wa = whatsappSuccesBase ? `${whatsappSuccesBase}${encodeURIComponent(`Bonjour, je viens d’envoyer la demande ${etat.numDem}.`)}` : null;
    return (
      <div className="rounded-[12px] border-2 border-ink bg-white p-6 sm:p-8" role="status">
        <h2 ref={titreSucces} tabIndex={-1} className="h2 outline-none">
          Demande envoyée
        </h2>
        <p className="mt-4 text-lg">Votre numéro de demande :</p>
        <p className="mt-1 font-display text-4xl font-bold tracking-tight sm:text-5xl">{etat.numDem}</p>
        <p className="mt-5 max-w-[56ch] text-muted">
          Notez ce numéro. Notre équipe vous contacte au numéro que vous avez indiqué pour lancer la maquette.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {wa && (
            <a href={wa} className="btn-wa">
              Prévenir l’équipe sur WhatsApp
            </a>
          )}
          <Link href="/" className="btn-secondary">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    );
  }

  const envoi = etat.phase === "envoi";

  return (
    <form onSubmit={envoyer} noValidate className="space-y-10">
      <fieldset className="space-y-5">
        <legend className="h3 mb-1">Vos coordonnées</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Champ id="prenom" label="Prénom" erreur={erreurs.prenom}>
            <input {...propsChamp("prenom")} type="text" autoComplete="given-name" />
          </Champ>
          <Champ id="nom" label="Nom" erreur={erreurs.nom}>
            <input {...propsChamp("nom")} type="text" autoComplete="family-name" />
          </Champ>
        </div>
        <Champ id="contact" label="Téléphone ou WhatsApp" aide="10 chiffres, par exemple 07 00 00 00 00." erreur={erreurs.contact}>
          <input {...propsChamp("contact", true)} type="tel" inputMode="tel" autoComplete="tel" />
        </Champ>
        <Champ id="email" label="Adresse e-mail" facultatif erreur={erreurs.email}>
          <input {...propsChamp("email")} type="email" autoComplete="email" />
        </Champ>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="h3 mb-1">Votre support</legend>
        <Champ id="typeSupport" label="Type de support" erreur={erreurs.typeSupport}>
          <select {...propsChamp("typeSupport")}>
            <option value="">Choisir…</option>
            {SUPPORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Champ>
        <Champ id="format" label="Format ou dimensions" facultatif aide="Par exemple : A5, 60 x 90 cm, 1080 x 1080 px." erreur={erreurs.format}>
          <input {...propsChamp("format", true)} type="text" />
        </Champ>
        <Champ id="style" label="Style et couleurs souhaités" facultatif aide="Par exemple : sobre, très coloré, vert et or." erreur={erreurs.style}>
          <input {...propsChamp("style", true)} type="text" />
        </Champ>
        <Champ id="description" label="Décrivez votre besoin" aide="À quoi sert ce support, à qui s’adresse-t-il, quels textes doivent y figurer ?" erreur={erreurs.description}>
          <textarea {...propsChamp("description", true)} rows={6} />
        </Champ>
        <Champ id="delai" label="Date souhaitée de livraison" facultatif erreur={erreurs.delai}>
          <input {...propsChamp("delai")} type="date" min={new Date().toISOString().slice(0, 10)} />
        </Champ>
      </fieldset>

      <fieldset className="space-y-4" id="modeles" tabIndex={-1}>
        <legend className="h3 mb-1">Modèles qui vous inspirent</legend>
        {modeles.length === 0 ? (
          <p className="text-muted">
            Aucun modèle choisi. Vous pouvez en <Link href="/modeles" className="link text-ink">parcourir le catalogue</Link> pour nous montrer ce que vous aimez.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {modeles.map((slug) => (
              <li key={slug} className="inline-flex items-center gap-1 rounded-[6px] border-2 border-ink bg-white pl-3">
                <span className="font-medium">{MODELES.find((m) => m.slug === slug)?.nom}</span>
                <button
                  type="button"
                  onClick={() => retirer(slug)}
                  className="inline-flex h-10 w-10 items-center justify-center hover:text-corail"
                  aria-label={`Retirer le modèle ${MODELES.find((m) => m.slug === slug)?.nom}`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M2 2l10 10M12 2L2 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        {erreurs.modeles && <p className="text-sm font-medium text-[#B3351D]">{erreurs.modeles}</p>}
      </fieldset>

      {/* Champ piège contre les robots : invisible et hors navigation clavier. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Ne pas remplir
          <input ref={piege} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {etat.phase === "erreur" && (
        <div role="alert" className="rounded-[8px] border-2 border-corail bg-white p-4">
          <p className="font-semibold">{etat.message}</p>
          {etat.indisponible && (
            <p className="mt-1 text-muted">
              {whatsapp ? (
                <>
                  Vous pouvez nous écrire directement sur{" "}
                  <a href={whatsapp} className="link text-ink">
                    WhatsApp
                  </a>
                  .
                </>
              ) : (
                <>
                  Vous pouvez nous joindre depuis la page{" "}
                  <Link href="/contact" className="link text-ink">
                    Contact
                  </Link>
                  .
                </>
              )}
            </p>
          )}
        </div>
      )}

      <div>
        <button type="submit" disabled={envoi} className="btn-primary w-full sm:w-auto disabled:opacity-60">
          {envoi ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>
      </div>
    </form>
  );
}
