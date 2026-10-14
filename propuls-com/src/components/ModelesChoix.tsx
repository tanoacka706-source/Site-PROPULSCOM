"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, categorieSingulier, type CategorieId } from "@/data/categories";
import type { Modele } from "@/data/modeles";
import { Visuel } from "./Visuel";

const MAX = 5;

export function ModelesChoix({ modeles }: { modeles: Modele[] }) {
  const [filtre, setFiltre] = useState<CategorieId | "toutes">("toutes");
  const [choisis, setChoisis] = useState<string[]>([]);

  const presentes = CATEGORIES.filter((c) => modeles.some((m) => m.categorie === c.id));
  const visibles = filtre === "toutes" ? modeles : modeles.filter((m) => m.categorie === filtre);

  const basculer = (slug: string) =>
    setChoisis((actuel) => (actuel.includes(slug) ? actuel.filter((s) => s !== slug) : actuel.length < MAX ? [...actuel, slug] : actuel));

  const lien = choisis.length > 0 ? `/demande?modeles=${choisis.join(",")}` : "/demande";

  return (
    <div className={choisis.length > 0 ? "pb-28" : ""}>
      <div role="group" aria-label="Filtrer par type de support" className="flex flex-wrap gap-2">
        {[{ id: "toutes" as const, label: "Tous" }, ...presentes].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={filtre === c.id}
            onClick={() => setFiltre(c.id)}
            className={`min-h-[44px] rounded-[6px] border-2 px-4 font-medium transition-colors ${
              filtre === c.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((m) => {
          const pris = choisis.includes(m.slug);
          const plein = !pris && choisis.length >= MAX;
          return (
            <li key={m.slug}>
              <div className={`rounded-[12px] border-2 p-2 transition-colors ${pris ? "border-ink" : "border-transparent"}`}>
                <Visuel categorie={m.categorie} graine={m.slug} image={m.image} alt={m.alt} mention />
              </div>
              <h3 className="h3 mt-4">{m.nom}</h3>
              <p className="mt-1 text-sm font-medium text-muted">{categorieSingulier(m.categorie)}</p>
              <p className="mt-2 max-w-[44ch]">{m.description}</p>
              <button
                type="button"
                aria-pressed={pris}
                disabled={plein}
                onClick={() => basculer(m.slug)}
                className={`mt-4 w-full ${pris ? "btn-primary" : "btn-secondary"} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {pris ? "Modèle choisi" : "Choisir ce modèle"}
              </button>
            </li>
          );
        })}
      </ul>

      {choisis.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur">
          <div className="container-x flex flex-wrap items-center justify-between gap-3 py-3">
            <p className="font-medium" aria-live="polite">
              {choisis.length} {choisis.length > 1 ? "modèles choisis" : "modèle choisi"}
              {choisis.length >= MAX && <span className="text-muted"> (maximum atteint)</span>}
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setChoisis([])} className="min-h-[44px] px-3 font-medium underline underline-offset-4">
                Tout retirer
              </button>
              <Link href={lien} className="btn-primary !min-h-[44px] !py-2">
                Continuer vers la demande
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
