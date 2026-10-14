import Link from "next/link";
import { Cta } from "@/components/Cta";
import { Epreuve } from "@/components/Epreuve";
import { Visuel } from "@/components/Visuel";
import { categorieSingulier } from "@/data/categories";
import { ETAPES } from "@/data/etapes";
import { REALISATIONS } from "@/data/realisations";
import { SERVICES } from "@/data/services";
import { whatsappLink } from "@/lib/site";

const ENCRE_BARRE = {
  bleu: "bg-bleu",
  orange: "bg-orange",
  corail: "bg-corail",
  ink: "bg-ink",
} as const;

export default function Accueil() {
  const wa = whatsappLink("Bonjour Propuls Com, j’aimerais créer un support de communication.");

  return (
    <>
      <section className="border-b border-line">
        <div className="container-x grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="display">Nous concevons les supports qui portent votre message.</h1>
            <p className="lead mt-7">
              Communication et événementiel à Abidjan. Vous choisissez un modèle, vous décrivez votre besoin, vous validez la maquette : affiches, flyers, bannières, cartes de visite et contenus digitaux.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/demande" className="btn-primary">
                Demander une création
              </Link>
              <Link href="/realisations" className="btn-secondary">
                Voir nos réalisations
              </Link>
            </div>
            {wa && (
              <p className="mt-5 text-muted">
                Vous préférez discuter ?{" "}
                <a href={wa} className="link text-ink">
                  Écrivez-nous sur WhatsApp
                </a>
                .
              </p>
            )}
          </div>
          <Epreuve className="mx-auto h-auto w-full max-w-[460px] lg:ml-auto" />
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="services-titre">
        <div className="container-x py-16 md:py-24">
          <div className="grid gap-4 md:grid-cols-[1fr_2fr] md:gap-12">
            <h2 id="services-titre" className="h2">
              Ce que nous faisons
            </h2>
            <p className="lead">De l’idée au support imprimé ou publié, une seule équipe suit votre projet.</p>
          </div>
          <ul className="mt-10 md:mt-14">
            {SERVICES.map((s) => (
              <li key={s.titre} className="grid gap-2 border-t border-line py-7 md:grid-cols-[1fr_2fr] md:gap-12">
                <h3 className="h3">{s.titre}</h3>
                <div>
                  <p className="max-w-[60ch]">{s.description}</p>
                  <p className="mt-2 text-sm font-medium text-muted">{s.exemples}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/services" className="link mt-6 inline-block font-semibold">
            Détail de nos services
          </Link>
        </div>
      </section>

      <section className="border-b border-line bg-white" aria-labelledby="etapes-titre">
        <div className="container-x py-16 md:py-24">
          <h2 id="etapes-titre" className="h2 max-w-[20ch]">
            Comment se passe une création
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {ETAPES.map((e, i) => (
              <li key={e.titre}>
                <div className={`h-1.5 w-full ${ENCRE_BARRE[e.encre]}`} aria-hidden="true" />
                <p className="mt-4 font-display text-4xl font-bold tracking-tight">{i + 1}</p>
                <h3 className="h3 mt-2">{e.titre}</h3>
                <p className="mt-2 text-muted">{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="realisations-titre">
        <div className="container-x py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="realisations-titre" className="h2">
              Quelques réalisations
            </h2>
            <Link href="/realisations" className="link font-semibold">
              Toutes les réalisations
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {REALISATIONS.slice(0, 3).map((r) => (
              <li key={r.slug}>
                <Visuel categorie={r.categorie} graine={r.slug} image={r.image} alt={r.alt} mention />
                <h3 className="h3 mt-4">{r.titre}</h3>
                <p className="mt-1 text-sm font-medium text-muted">{categorieSingulier(r.categorie)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cta />
    </>
  );
}
