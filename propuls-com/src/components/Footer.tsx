import Link from "next/link";
import { NAV, SITE, whatsappLink } from "@/lib/site";
import { Marque } from "./Marque";

export function Footer() {
  const wa = whatsappLink();
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Marque taille={36} id="sphere-pied" />
            <span className="font-display text-xl font-bold tracking-tight">
              PROPULS<span className="text-gris">Com</span>
            </span>
          </div>
          <p className="mt-2 text-sm font-medium tracking-[0.18em] text-white/70">COMMUNICATION · ÉVÉNEMENTIEL</p>
          <p className="mt-4 max-w-[38ch] text-white/75">
            Agence de communication et d’événementiel à Abidjan : design graphique, impression, contenus digitaux et organisation d’événements.
          </p>
        </div>

        <nav aria-label="Pied de page">
          <p className="font-display text-lg font-semibold">Le site</p>
          <ul className="mt-3 space-y-1">
            {[...NAV, { href: "/demande", label: "Demander une création" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-[40px] items-center text-white/80 underline-offset-4 hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-display text-lg font-semibold">Nous trouver</p>
          <address className="mt-3 not-italic text-white/80">
            {SITE.adresse.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          <ul className="mt-4 space-y-1">
            {wa && (
              <li>
                <a href={wa} className="inline-flex min-h-[40px] items-center text-white underline underline-offset-4 hover:decoration-orange">
                  Écrire sur WhatsApp
                </a>
              </li>
            )}
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className="inline-flex min-h-[40px] items-center text-white underline underline-offset-4 hover:decoration-orange">
                  {SITE.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="container-x py-5 text-sm text-white/65">© {new Date().getFullYear()} Propuls Com. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
