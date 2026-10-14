import type { CategorieId } from "./categories";

export type Modele = {
  slug: string;
  nom: string;
  categorie: CategorieId;
  description: string;
  image?: string;
  alt?: string;
};

// Catalogue consultable par les clients. Le `slug` est enregistré avec chaque demande (relation « inspirer »).
// À REMPLACER ou compléter par vos vrais modèles (voir README).
export const MODELES: Modele[] = [
  { slug: "affiche-evenement", nom: "Affiche événement", categorie: "affiche", description: "Grand titre, date et lieu bien visibles." },
  { slug: "affiche-promotion", nom: "Affiche promotion", categorie: "affiche", description: "Prix ou offre mis en avant, couleurs vives." },
  { slug: "flyer-annonce", nom: "Flyer annonce", categorie: "flyer", description: "Un seul message, un appel à l’action." },
  { slug: "flyer-recto-verso", nom: "Flyer recto-verso", categorie: "flyer", description: "Présentation au recto, détails et contacts au verso." },
  { slug: "carte-visite-sobre", nom: "Carte de visite sobre", categorie: "carte-de-visite", description: "Logo, nom et coordonnées, beaucoup d’espace." },
  { slug: "carte-visite-creative", nom: "Carte de visite créative", categorie: "carte-de-visite", description: "Couleur franche et forme décalée." },
  { slug: "plaquette-trois-volets", nom: "Plaquette trois volets", categorie: "plaquette", description: "Présentation, services et contact en trois volets." },
  { slug: "banniere-manifestation", nom: "Bannière de manifestation", categorie: "banniere", description: "Format large pour scène, entrée ou stand." },
  { slug: "post-reseaux-sociaux", nom: "Post réseaux sociaux", categorie: "digital", description: "Visuel carré, texte court, identité reconnaissable." },
  { slug: "charte-graphique-base", nom: "Charte graphique de base", categorie: "identite", description: "Logo, couleurs et typographies sur une page." },
];

export const MODELE_SLUGS = MODELES.map((m) => m.slug);

export function modeleParSlug(slug: string): Modele | undefined {
  return MODELES.find((m) => m.slug === slug);
}
