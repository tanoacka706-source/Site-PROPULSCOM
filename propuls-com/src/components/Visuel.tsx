import Image from "next/image";
import type { CategorieId } from "@/data/categories";

type Encre = "bleu" | "orange" | "corail" | "ink";
const ENCRES: Encre[] = ["bleu", "orange", "corail", "ink"];

const col = (e: Encre | "paper", alpha = 1) => `rgb(var(--c-${e}) / ${alpha})`;

function graine(texte: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < texte.length; i++) {
    h ^= texte.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Lignes({ x, y, w, n, couleur, ecart = 14 }: { x: number; y: number; w: number; n: number; couleur: string; ecart?: number }) {
  return (
    <g fill={couleur}>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x} y={y + i * ecart} width={i === n - 1 ? w * 0.6 : w} height={6} rx={2} />
      ))}
    </g>
  );
}

function Maquette({ categorie, principale, accent }: { categorie: CategorieId; principale: Encre; accent: Encre }) {
  const P = col(principale);
  const A = col(accent);
  const papier = col("paper");
  const encreTexte = principale === "orange" ? col("ink") : papier;

  switch (categorie) {
    case "affiche":
      return (
        <g>
          <rect x="100" y="80" width="200" height="300" rx="3" fill={P} />
          <circle cx="200" cy="185" r="62" fill={A} />
          <rect x="124" y="285" width="130" height="16" rx="3" fill={encreTexte} />
          <rect x="124" y="309" width="84" height="10" rx="3" fill={encreTexte} opacity="0.7" />
          <Lignes x={124} y={334} w={120} n={2} couleur={encreTexte} />
        </g>
      );
    case "flyer":
      return (
        <g>
          <g transform="rotate(6 200 250)">
            <rect x="118" y="86" width="170" height="260" rx="3" fill={A} opacity="0.55" />
          </g>
          <g transform="rotate(-4 200 250)">
            <rect x="112" y="94" width="176" height="270" rx="3" fill={papier} stroke={col("ink", 0.2)} />
            <polygon points="112,94 288,94 288,170 112,230" fill={P} />
            <rect x="132" y="256" width="110" height="12" rx="3" fill={col("ink")} />
            <Lignes x={132} y={282} w={130} n={3} couleur={col("ink", 0.4)} />
          </g>
        </g>
      );
    case "carte-de-visite":
      return (
        <g>
          <g transform="rotate(-7 200 210)">
            <rect x="70" y="150" width="260" height="150" rx="6" fill={A} />
          </g>
          <g transform="rotate(3 200 290)">
            <rect x="90" y="215" width="260" height="150" rx="6" fill={papier} stroke={col("ink", 0.2)} />
            <circle cx="132" cy="262" r="16" fill={P} />
            <rect x="160" y="252" width="90" height="10" rx="3" fill={col("ink")} />
            <Lignes x={118} y={306} w={130} n={3} couleur={col("ink", 0.4)} ecart={13} />
          </g>
        </g>
      );
    case "plaquette":
      return (
        <g>
          <rect x="48" y="110" width="100" height="280" rx="3" fill={P} />
          <rect x="150" y="110" width="100" height="280" fill={papier} stroke={col("ink", 0.2)} />
          <rect x="252" y="110" width="100" height="280" rx="3" fill={A} />
          <circle cx="98" cy="190" r="26" fill={A} />
          <Lignes x={64} y={270} w={68} n={4} couleur={encreTexte} />
          <Lignes x={166} y={140} w={68} n={8} couleur={col("ink", 0.4)} />
          <rect x="268" y="140" width="68" height="68" rx="3" fill={papier} opacity="0.85" />
          <Lignes x={268} y={236} w={68} n={3} couleur={papier} />
        </g>
      );
    case "banniere":
      return (
        <g>
          <rect x="30" y="170" width="340" height="140" rx="4" fill={P} />
          {[44, 356].flatMap((cx) => [184, 296].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill={papier} />))}
          <rect x="62" y="206" width="170" height="20" rx="4" fill={encreTexte} />
          <rect x="62" y="236" width="120" height="12" rx="3" fill={encreTexte} opacity="0.7" />
          <circle cx="300" cy="240" r="46" fill={A} />
        </g>
      );
    case "digital":
      return (
        <g>
          <rect x="140" y="60" width="120" height="380" rx="24" fill={col("ink")} />
          <rect x="150" y="82" width="100" height="336" rx="14" fill={papier} />
          <rect x="158" y="96" width="84" height="84" rx="6" fill={P} />
          <circle cx="200" cy="138" r="22" fill={A} />
          <Lignes x={158} y={192} w={84} n={2} couleur={col("ink", 0.4)} />
          <rect x="158" y="228" width="84" height="84" rx="6" fill={A} />
          <rect x="172" y="262" width="56" height="12" rx="3" fill={col("paper")} />
          <Lignes x={158} y={324} w={84} n={2} couleur={col("ink", 0.4)} />
        </g>
      );
    case "identite":
      return (
        <g>
          <rect x="90" y="80" width="220" height="220" rx="16" fill={P} />
          <circle cx="170" cy="190" r="42" fill={A} />
          <circle cx="226" cy="190" r="42" fill={papier} opacity="0.9" />
          {ENCRES.map((e, i) => (
            <circle key={e} cx={125 + i * 50} cy="352" r="18" fill={col(e)} />
          ))}
          <Lignes x={90} y={394} w={220} n={2} couleur={col("ink", 0.35)} />
        </g>
      );
  }
}

type Props = {
  categorie: CategorieId;
  graine: string;
  image?: string;
  alt?: string;
  className?: string;
  /** Affiche la mention « Visuel d'exemple » lorsqu'aucune vraie image n'est fournie. */
  mention?: boolean;
};

/** Vraie image si elle existe, sinon visuel d'exemple généré (mise en page du support, aux couleurs de la marque). */
export function Visuel({ categorie, graine: g, image, alt, className = "", mention = false }: Props) {
  if (image) {
    return (
      <div className={`relative aspect-[4/5] overflow-hidden rounded-[10px] bg-line ${className}`}>
        <Image src={image} alt={alt ?? ""} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" className="object-cover" />
      </div>
    );
  }

  const rnd = graine(g);
  const principale = ENCRES[Math.floor(rnd() * 4)];
  const accents = ENCRES.filter((e) => e !== principale && e !== "ink");
  const accent = accents[Math.floor(rnd() * accents.length)];

  return (
    <div className={`relative aspect-[4/5] overflow-hidden rounded-[10px] ${className}`} style={{ background: col(principale, 0.13) }}>
      <svg viewBox="0 0 400 500" className="h-full w-full" aria-hidden="true" focusable="false">
        <Maquette categorie={categorie} principale={principale} accent={accent} />
      </svg>
      {mention && (
        <span className="absolute bottom-3 left-3 rounded-[4px] bg-white/90 px-2 py-1 text-xs font-medium text-muted">
          Visuel d’exemple
        </span>
      )}
    </div>
  );
}
