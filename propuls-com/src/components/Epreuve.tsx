import { Sphere } from "./Sphere";

/**
 * Épreuve d'imprimeur : le visuel d'accueil. La sphère du logo se compose sur la feuille (mouvement unique de la page),
 * entourée de repères de coupe, d'une cible de repérage et de la bande de couleurs de la marque.
 */
const BANDE: { classe: string; opacite?: number }[] = [
  { classe: "fill-bleu" },
  { classe: "fill-orange" },
  { classe: "fill-corail" },
  { classe: "fill-ink" },
  { classe: "fill-gris" },
  { classe: "fill-bleu", opacite: 0.4 },
  { classe: "fill-orange", opacite: 0.4 },
  { classe: "fill-corail", opacite: 0.4 },
];

export function Epreuve({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 540"
      role="img"
      aria-label="Épreuve d’imprimeur montrant la sphère du logo Propuls Com et sa palette de couleurs"
      className={className}
    >
      {/* feuille */}
      <rect x="60" y="40" width="360" height="450" className="fill-white stroke-ink/20" strokeWidth="1" />

      {/* repères de coupe */}
      <g className="stroke-ink" strokeWidth="1">
        <path d="M60 28v-16M48 40H32M420 28v-16M432 40h16M60 502v16M48 490H32M420 502v16M432 490h16" />
      </g>

      {/* cibles de repérage */}
      <g className="stroke-ink fill-none" strokeWidth="1">
        <circle cx="240" cy="20" r="8" />
        <path d="M240 8v24M228 20h24" />
        <circle cx="240" cy="510" r="8" />
        <path d="M240 498v24M228 510h24" />
      </g>

      {/* sphère du logo */}
      <g transform="translate(105 80) scale(1.35)">
        <Sphere id="sphere-epreuve" animer />
      </g>

      {/* lignes de texte de la feuille */}
      <g className="fill-ink">
        <rect x="90" y="396" width="150" height="8" rx="2" opacity="0.85" />
        <rect x="90" y="412" width="96" height="6" rx="2" opacity="0.35" />
      </g>

      {/* bande des couleurs de la marque */}
      <g>
        {BANDE.map((b, i) => (
          <rect key={i} x={90 + i * 37.5} y="440" width="37.5" height="30" className={b.classe} opacity={b.opacite ?? 1} />
        ))}
      </g>
    </svg>
  );
}
