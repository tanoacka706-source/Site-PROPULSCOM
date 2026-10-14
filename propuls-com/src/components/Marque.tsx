import { Sphere } from "./Sphere";

/** Sphère du logo, seule (pied de page, petits formats). Le logo complet est affiché par l'en-tête. */
export function Marque({ taille = 32, id = "sphere-marque" }: { taille?: number; id?: string }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <Sphere id={id} />
    </svg>
  );
}
