import { z } from "zod";
import { SUPPORT_IDS } from "@/data/categories";
import { MODELE_SLUGS } from "@/data/modeles";

const texteOptionnel = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Maximum ${max} caractères.`)
    .optional()
    .transform((v) => (v ? v : undefined));

/** Numéro ivoirien à 10 chiffres, avec ou sans +225 / 00225. Normalisé en +225XXXXXXXXXX. */
const telephone = z
  .string()
  .trim()
  .min(1, "Indiquez votre numéro de téléphone.")
  .transform((v) => v.replace(/[\s.\-()]/g, ""))
  .refine((v) => /^(\+225|00225)?\d{10}$/.test(v), "Entrez un numéro à 10 chiffres, par exemple 07 00 00 00 00.")
  .transform((v) => `+225${v.slice(-10)}`);

const dateDuJour = () => new Date().toISOString().slice(0, 10);

export const demandeSchema = z.object({
  prenom: z.string().trim().min(2, "Indiquez votre prénom.").max(60, "Maximum 60 caractères."),
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(60, "Maximum 60 caractères."),
  contact: telephone,
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || z.email().safeParse(v).success, "Cette adresse e-mail n’est pas valide."),
  typeSupport: z.enum(SUPPORT_IDS, "Choisissez le type de support."),
  format: texteOptionnel(120),
  style: texteOptionnel(300),
  description: z
    .string()
    .trim()
    .min(20, "Décrivez votre besoin en quelques phrases (20 caractères minimum).")
    .max(2000, "Maximum 2 000 caractères."),
  delai: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || /^\d{4}-\d{2}-\d{2}$/.test(v), "Date invalide.")
    .refine((v) => v === undefined || v >= dateDuJour(), "Choisissez une date à partir d’aujourd’hui."),
  modeles: z
    .array(z.string())
    .max(5, "Vous pouvez choisir jusqu’à 5 modèles.")
    .refine((l) => l.every((s) => MODELE_SLUGS.includes(s)), "Modèle inconnu."),
  // Champ piège : invisible pour les humains, rempli par les robots.
  website: z.string().max(200).optional(),
});

export type DemandeEntree = z.input<typeof demandeSchema>;
export type DemandeValidee = z.output<typeof demandeSchema>;

/** Regroupe les erreurs par champ, pour l'affichage dans le formulaire. */
export function erreursParChamp(error: z.ZodError): Record<string, string> {
  const resultat: Record<string, string> = {};
  for (const issue of error.issues) {
    const champ = String(issue.path[0] ?? "form");
    if (!resultat[champ]) resultat[champ] = issue.message;
  }
  return resultat;
}
