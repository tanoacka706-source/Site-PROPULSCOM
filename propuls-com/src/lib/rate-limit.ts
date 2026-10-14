// Limiteur simple en mémoire : suffisant pour freiner les abus sur un site vitrine.
// Sur Vercel, chaque instance a sa propre mémoire : c'est une protection partielle, pas absolue.
const FENETRE_MS = 10 * 60 * 1000;
const MAX_PAR_FENETRE = 5;

const compteurs = new Map<string, { n: number; debut: number }>();

export function limiteAtteinte(cle: string): boolean {
  const maintenant = Date.now();

  if (compteurs.size > 5000) {
    for (const [k, v] of compteurs) if (maintenant - v.debut > FENETRE_MS) compteurs.delete(k);
  }

  const courant = compteurs.get(cle);
  if (!courant || maintenant - courant.debut > FENETRE_MS) {
    compteurs.set(cle, { n: 1, debut: maintenant });
    return false;
  }
  courant.n += 1;
  return courant.n > MAX_PAR_FENETRE;
}
