import type { Metadata } from "next";
import Link from "next/link";
import { Cta } from "@/components/Cta";
import { TitrePage } from "@/components/Titre";
import { SERVICES } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Design graphique, identité visuelle, contenus digitaux, impression, événementiel et rédaction : les services de Propuls Com à Abidjan.",
};

export default function Services() {
  return (
    <>
      <TitrePage
        titre="Nos services"
        intro="Propuls Com accompagne les entreprises, associations et organisateurs d’événements qui veulent toucher plus facilement leur cible."
      />
      <section className="container-x py-12 md:py-16">
        <ul>
          {SERVICES.map((s) => (
            <li key={s.titre} className="grid gap-3 border-t border-line py-9 md:grid-cols-[1fr_2fr] md:gap-12">
              <h2 className="h2 !text-[1.75rem]">{s.titre}</h2>
              <div>
                <p className="max-w-[60ch] text-lg">{s.description}</p>
                <p className="mt-3 font-medium text-muted">{s.exemples}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[60ch] text-muted">
          Vous ne trouvez pas exactement votre besoin ? Décrivez-le dans la{" "}
          <Link href="/demande" className="link text-ink">
            demande de création
          </Link>
          , nous vous dirons ce que nous pouvons faire.
        </p>
      </section>
      <Cta />
    </>
  );
}
