export const CATEGORIES = [
  { id: "affiche", label: "Affiches", singulier: "Affiche" },
  { id: "flyer", label: "Flyers", singulier: "Flyer" },
  { id: "carte-de-visite", label: "Cartes de visite", singulier: "Carte de visite" },
  { id: "plaquette", label: "Plaquettes", singulier: "Plaquette" },
  { id: "banniere", label: "Bannières", singulier: "Bannière" },
  { id: "digital", label: "Contenus digitaux", singulier: "Contenu digital" },
  { id: "identite", label: "Identité visuelle", singulier: "Identité visuelle" },
] as const;

export type CategorieId = (typeof CATEGORIES)[number]["id"];

export function categorieSingulier(id: CategorieId): string {
  return CATEGORIES.find((c) => c.id === id)?.singulier ?? id;
}

/** Types de support proposés dans le formulaire de demande. */
export const SUPPORTS = [
  ...CATEGORIES.map((c) => ({ id: c.id as string, label: c.singulier })),
  { id: "autre", label: "Autre support" },
] as const;

export const SUPPORT_IDS = SUPPORTS.map((s) => s.id) as [string, ...string[]];
