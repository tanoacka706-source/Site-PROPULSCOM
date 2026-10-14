import type { Metadata } from "next";
import Link from "next/link";
import { TitrePage } from "@/components/Titre";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Propuls Com, communication et événementiel, est à Marcory Résidentiel, en face du stade Champroux, à Abidjan. Écrivez-nous sur WhatsApp ou envoyez une demande en ligne.",
};

export default function Contact() {
  const wa = whatsappLink("Bonjour Propuls Com,");
  const plan = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.recherchePlan)}`;

  return (
    <>
      <TitrePage titre="Contact" intro="Passez nous voir, écrivez-nous ou envoyez directement votre demande en ligne." />
      <section className="container-x grid gap-12 py-12 md:grid-cols-2 md:py-16">
        <div>
          <h2 className="h3">Nous trouver</h2>
          <address className="mt-3 not-italic text-lg">
            {SITE.adresse.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          <a href={plan} className="link mt-4 inline-block font-semibold" target="_blank" rel="noopener noreferrer">
            Ouvrir dans Google Maps<span className="sr-only"> (nouvel onglet)</span>
          </a>
        </div>

        <div>
          <h2 className="h3">Nous écrire</h2>
          <div className="mt-4 flex flex-col items-start gap-3">
            {wa && (
              <a href={wa} className="btn-wa">
                Écrire sur WhatsApp
              </a>
            )}
            {SITE.email && (
              <a href={`mailto:${SITE.email}`} className="link text-lg font-semibold">
                {SITE.email}
              </a>
            )}
            <Link href="/demande" className={wa ? "btn-secondary" : "btn-primary"}>
              Envoyer une demande de création
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
