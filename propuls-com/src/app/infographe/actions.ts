"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { limiteAtteinte } from "@/lib/rate-limit";
import {
  authentificationConfiguree,
  creerSessionInfographe,
  identifiantsValides,
  INFOGRAPHE_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/infographe-auth";

export type EtatConnexion = { erreur: string } | null;

function adresseIp(transmise: string | null): string {
  return transmise?.split(",")[0]?.trim() || "inconnue";
}

export async function seConnecter(_etat: EtatConnexion, formData: FormData): Promise<EtatConnexion> {
  const entetes = await headers();
  if (limiteAtteinte(`connexion-infographe:${adresseIp(entetes.get("x-forwarded-for"))}`)) {
    return { erreur: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  if (!authentificationConfiguree()) {
    return { erreur: "L’accès doit être configuré par l’administrateur du site avant la connexion." };
  }

  const email = formData.get("email");
  const motDePasse = formData.get("password");
  if (
    typeof email !== "string" ||
    typeof motDePasse !== "string" ||
    email.length > 254 ||
    motDePasse.length > 1024 ||
    !identifiantsValides(email, motDePasse)
  ) {
    return { erreur: "Adresse e-mail ou mot de passe incorrect." };
  }

  const jeton = creerSessionInfographe();
  if (!jeton) {
    return { erreur: "La configuration de sécurité est incomplète. Contactez l’administrateur du site." };
  }

  const cookiesReponse = await cookies();
  cookiesReponse.set(INFOGRAPHE_COOKIE, jeton, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/infographe",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/infographe");
}

export async function seDeconnecter(): Promise<void> {
  const cookiesReponse = await cookies();
  cookiesReponse.set(INFOGRAPHE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/infographe",
    maxAge: 0,
  });
  redirect("/infographe");
}