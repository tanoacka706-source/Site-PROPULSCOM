import Link from "next/link";
import { whatsappLink } from "@/lib/site";

export function Cta() {
  const wa = whatsappLink("Bonjour Propuls Com, j’aimerais créer un support de communication.");
  return (
    <section className="bg-ink text-white" aria-labelledby="cta-titre">
      <div className="container-x grid gap-8 py-16 md:grid-cols-[1.4fr_1fr] md:items-center md:py-20">
        <div>
          <h2 id="cta-titre" className="h2">
            Un support à créer ?
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg text-white/80">
            Décrivez votre besoin en quelques minutes. Nous préparons une première maquette et nous la reprenons avec vous jusqu’à la validation.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link href="/demande" className="btn-light">
            Demander une création
          </Link>
          {wa && (
            <a href={wa} className="btn border-2 border-white/60 text-white hover:bg-white hover:text-ink">
              Écrire sur WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
