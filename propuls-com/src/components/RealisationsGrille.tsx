"use client";

import { useState } from "react";
import { CATEGORIES, categorieSingulier, type CategorieId } from "@/data/categories";
import type { Realisation } from "@/data/realisations";
import { Visuel } from "./Visuel";

export function RealisationsGrille({ realisations }: { realisations: Realisation[] }) {
  const [filtre, setFiltre] = useState<CategorieId | "toutes">("toutes");

  const presentes = CATEGORIES.filter((c) => realisations.some((r) => r.categorie === c.id));
  const visibles = filtre === "toutes" ? realisations : realisations.filter((r) => r.categorie === filtre);

  return (
    <div>
      <div role="group" aria-label="Filtrer par type de support" className="flex flex-wrap gap-2">
        {[{ id: "toutes" as const, label: "Toutes" }, ...presentes].map((c) => (
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

      <p className="mt-5 text-muted" aria-live="polite">
        {visibles.length} {visibles.length > 1 ? "réalisations" : "réalisation"}
      </p>

      <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((r) => (
          <li key={r.slug}>
            <Visuel categorie={r.categorie} graine={r.slug} image={r.image} alt={r.alt} mention />
            <h3 className="h3 mt-4">{r.titre}</h3>
            <p className="mt-1 text-sm font-medium text-muted">{categorieSingulier(r.categorie)}</p>
            <p className="mt-2 max-w-[44ch]">{r.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
