export const SITE = {
  nom: "Propuls Com",
  description:
    "Propuls Com, agence de communication et d’événementiel à Abidjan : affiches, flyers, bannières, cartes de visite et contenus digitaux. Choisissez un modèle, décrivez votre besoin, validez la maquette.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  adresse: ["Marcory Résidentiel", "En face du stade Champroux, à l’entrée de la Tribune B", "Abidjan, Côte d’Ivoire"],
  recherchePlan: "Propuls Com Stade Champroux Marcory Abidjan",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
} as const;

const whatsappNumero = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");

/** Lien WhatsApp, ou null tant que le numéro n'est pas renseigné dans .env. */
export function whatsappLink(message?: string): string | null {
  if (whatsappNumero.length < 8) return null;
  const texte = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${whatsappNumero}${texte}`;
}

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/modeles", label: "Modèles" },
  { href: "/contact", label: "Contact" },
] as const;
