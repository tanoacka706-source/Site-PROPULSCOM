import type { Metadata } from "next";
import { ModelesChoix } from "@/components/ModelesChoix";
import { TitrePage } from "@/components/Titre";
import { MODELES } from "@/data/modeles";

export const metadata: Metadata = {
  title: "Modèles",
  description: "Parcourez les modèles de Propuls Com et choisissez ceux qui vous inspirent pour votre demande de création.",
};

export default function Modeles() {
  return (
    <>
      <TitrePage
        titre="Nos modèles"
        intro="Un modèle aide à dire ce que vous aimez : style, couleurs, format. Choisissez-en jusqu’à cinq, ils seront joints à votre demande."
      />
      <section className="container-x py-12 md:py-16">
        <ModelesChoix modeles={MODELES} />
      </section>
    </>
  );
}
