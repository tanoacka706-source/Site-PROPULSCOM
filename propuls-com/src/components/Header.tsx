"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Lien = { href: string; label: string };

export function Header({ liens }: { liens: readonly Lien[] }) {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => setOuvert(false), [chemin]);

  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", fermer);
    return () => window.removeEventListener("keydown", fermer);
  }, [ouvert]);

  const actif = (href: string) => chemin === href || chemin.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label="Propuls Com, communication et événementiel : accueil">
          <Image src="/logo-propulscom.png" alt="" width={517} height={116} priority className="h-11 w-auto sm:h-12" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={actif(l.href) ? "page" : undefined}
              className={`rounded-[6px] px-3.5 py-2 font-medium hover:bg-ink/5 ${actif(l.href) ? "underline decoration-orange decoration-2 underline-offset-8" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/demande" className="btn-primary ml-3 !min-h-[44px] !py-2">
            Demander une création
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex h-12 w-12 items-center justify-center rounded-[6px] hover:bg-ink/5 md:hidden"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOuvert((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {ouvert ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {ouvert && (
        <nav id="menu-mobile" aria-label="Navigation principale" className="border-t border-line bg-paper md:hidden">
          <ul className="container-x flex flex-col py-3">
            {liens.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={actif(l.href) ? "page" : undefined}
                  className="flex min-h-[52px] items-center border-b border-line font-display text-xl font-semibold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <Link href="/demande" className="btn-primary w-full">
                Demander une création
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
