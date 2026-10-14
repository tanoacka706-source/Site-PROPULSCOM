import type { Metadata } from "next";
import { Cta } from "@/components/Cta";
import { RealisationsGrille } from "@/components/RealisationsGrille";
import { TitrePage } from "@/components/Titre";
import { REALISATIONS } from "@/data/realisations";

export const metadata: Metadata = {
  title: "Réalisations",
  description: "Affiches, flyers, cartes de visite, plaquettes, bannières et contenus digitaux réalisés par Propuls Com.",
};

export default function Realisations() {
  return (
    <>
      <TitrePage titre="Nos réalisations" intro="Des supports de communication conçus pour être lus, regardés et retenus. Filtrez par type de support." />
      <section className="container-x py-12 md:py-16">
        <RealisationsGrille realisations={REALISATIONS} />
      </section>
      <Cta />
    </>
  );
}
