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

export const REALISATIONS: Realisation[] = [
  {
    slug: "festival-des-lagunes",
    titre: "Festival des Lagunes",
    categorie: "affiche",
    description: "Concept de campagne pour un festival de musique à Abidjan. Photo d’ambiance libre de droits.",
    image: "/realisations/festival-concept.jpg",
    alt: "Scène de concert avec le public et des confettis, photo d’ambiance Unsplash",
  },
  {
    slug: "saveurs-abidjan",
    titre: "Saveurs d’Abidjan",
    categorie: "flyer",
    description: "Concept de flyer pour faire découvrir une adresse et ses spécialités. Photo d’ambiance libre de droits.",
    image: "/realisations/restaurant-concept.jpg",
    alt: "Plat servi avec des légumes et des épices, photo d’ambiance Unsplash",
  },
  {
    slug: "scene-ouverte",
    titre: "Scène ouverte",
    categorie: "digital",
    description: "Concept de publication pour annoncer une soirée musicale et mettre les artistes en avant. Photo d’ambiance libre de droits.",
    image: "/realisations/musique-concept.jpg",
    alt: "Microphone sur scène éclairé par des projecteurs, photo d’ambiance Unsplash",
  },
];
