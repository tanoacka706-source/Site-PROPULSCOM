export type Service = {
  titre: string;
  description: string;
  exemples: string;
};

export const SERVICES: Service[] = [
  {
    titre: "Design graphique",
    description:
      "Nous concevons vos supports à partir de votre besoin et des modèles que vous aimez, puis nous les ajustons avec vous jusqu’à la version finale.",
    exemples: "Affiches, flyers, bannières, cartes de visite",
  },
  {
    titre: "Identité visuelle",
    description:
      "Un logo, des couleurs et des règles d’usage cohérentes, pour que votre structure soit reconnue sur tous ses supports.",
    exemples: "Logo, charte graphique, déclinaisons",
  },
  {
    titre: "Contenus digitaux",
    description:
      "Des visuels, des vidéos et des photos pensés pour les réseaux sociaux et les écrans, à la bonne taille et au bon ton.",
    exemples: "Visuels de réseaux sociaux, vidéos, photos",
  },
  {
    titre: "Impression",
    description:
      "Des supports prêts à distribuer : nous préparons les fichiers et suivons la fabrication pour que le rendu soit fidèle à la maquette validée.",
    exemples: "Plaquettes publicitaires, cartes de visite, supports imprimés",
  },
  {
    titre: "Événementiel",
    description:
      "Propuls Com est née de l’organisation d’événements culturels à fort impact social. Nous construisons le dispositif de communication autour de votre événement.",
    exemples: "Événements culturels, manifestations, lancements",
  },
  {
    titre: "Concepts et rédaction",
    description:
      "Une équipe qui imagine l’idée, trouve le slogan et rédige les textes de vos campagnes pour toucher plus facilement votre cible.",
    exemples: "Concepts créatifs, slogans, textes publicitaires",
  },
];
