import type { CSSProperties } from "react";

/**
 * Sphère du logo Propuls Com, redessinée en vecteur (bandes bleu, orange et corail).
 * Dessinée dans un repère 200 x 200 : l'appelant la place et la dimensionne.
 * `animer` fait glisser les bandes jusqu'à leur place (utilisé sur la page d'accueil).
 */
const BANDES = [
  { classe: "stroke-corail", largeur: 18, y: 56 },
  { classe: "stroke-bleu", largeur: 30, y: 92 },
  { classe: "stroke-orange", largeur: 30, y: 128 },
  { classe: "stroke-corail", largeur: 22, y: 160 },
  { classe: "stroke-bleu", largeur: 16, y: 188 },
  { classe: "stroke-orange", largeur: 11, y: 210 },
];

export function Sphere({ id, animer = false }: { id: string; animer?: boolean }) {
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`} fill="none">
        {BANDES.map((b, i) => (
          <path
            key={i}
            d={`M-30 ${b.y}Q105 ${b.y - 36} 230 ${b.y - 115}`}
            strokeWidth={b.largeur}
            className={`${b.classe} ${animer ? "settle" : ""}`}
            style={animer ? ({ "--dx": "-90px", "--dy": "55px", animationDelay: `${i * 80}ms` } as CSSProperties) : undefined}
          />
        ))}
      </g>
      <ellipse cx="100" cy="186" rx="30" ry="6" className="fill-bleu" />
    </g>
  );
}
