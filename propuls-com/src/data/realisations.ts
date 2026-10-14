import type { CategorieId } from "./categories";

export type Realisation = {
  slug: string;
  titre: string;
  categorie: CategorieId;
  description: string;
  /** Chemin d'une vraie image placée dans /public/realisations (ex. "/realisations/affiche-concert.webp"). Sans image, un visuel d'exemple est affiché. */
  image?: string;
  /** Texte alternatif de l'image (obligatoire si `image` est renseignée). */
  alt?: string;
};

// À REMPLACER par les vrais travaux de Propuls Com (voir README, section « Ajouter vos réalisations »).
export const REALISATIONS: Realisation[] = [
  {
    slug: "affiche-evenement-culturel",
    titre: "Affiche d’événement culturel",
    categorie: "affiche",
    description: "Affiche grand format pour un événement culturel, lisible de loin.",
  },
  {
    slug: "flyer-lancement",
    titre: "Flyer de lancement",
    categorie: "flyer",
    description: "Flyer recto-verso pour annoncer l’ouverture d’une activité.",
  },
  {
    slug: "carte-visite-professionnelle",
    titre: "Carte de visite professionnelle",
    categorie: "carte-de-visite",
    description: "Carte sobre avec logo, coordonnées et mise en page aérée.",
  },
  {
    slug: "plaquette-presentation",
    titre: "Plaquette de présentation",
    categorie: "plaquette",
    description: "Plaquette à trois volets présentant les services d’une entreprise.",
  },
  {
    slug: "banniere-manifestation",
    titre: "Bannière de manifestation",
    categorie: "banniere",
    description: "Bannière large pour une scène, une entrée ou un stand.",
  },
  {
    slug: "visuels-reseaux-sociaux",
    titre: "Visuels pour réseaux sociaux",
    categorie: "digital",
    description: "Série de visuels carrés à la même identité pour animer une page.",
  },
  {
    slug: "identite-association",
    titre: "Identité visuelle d’une association",
    categorie: "identite",
    description: "Logo, palette de couleurs et règles d’usage pour une association.",
  },
  {
    slug: "affiche-promotion",
    titre: "Affiche promotionnelle",
    categorie: "affiche",
    description: "Affiche percutante pour une offre limitée dans le temps.",
  },
  {
    slug: "flyer-annonce",
    titre: "Flyer d’annonce",
    categorie: "flyer",
    description: "Flyer A5 avec un message principal et un appel à l’action clair.",
  },
];
