import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const INFOGRAPHE_COOKIE = "propuls_infographe_session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function sessionSecret(): string | null {
  const secret = process.env.INFOGRAPHE_SESSION_SECRET;
  return secret && Buffer.byteLength(secret, "utf8") >= 32 ? secret : null;
}

export function authentificationConfiguree(): boolean {
  return Boolean(
    process.env.INFOGRAPHE_EMAIL?.trim() &&
      process.env.INFOGRAPHE_PASSWORD &&
      sessionSecret(),
  );
}

function egalEnTempsConstant(a: string, b: string): boolean {
  const empreinteA = createHash("sha256").update(a).digest();
  const empreinteB = createHash("sha256").update(b).digest();
  return timingSafeEqual(empreinteA, empreinteB);
}

export function identifiantsValides(email: string, motDePasse: string): boolean {
  const emailConfigure = process.env.INFOGRAPHE_EMAIL?.trim();
  const motDePasseConfigure = process.env.INFOGRAPHE_PASSWORD;
  if (!emailConfigure || !motDePasseConfigure || !sessionSecret()) return false;

  return (
    egalEnTempsConstant(email.trim().toLowerCase(), emailConfigure.toLowerCase()) &&
    egalEnTempsConstant(motDePasse, motDePasseConfigure)
  );
}

export function creerSessionInfographe(): string | null {
  const secret = sessionSecret();
  if (!secret) return null;

  const expiration = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const contenu = String(expiration);
  const signature = createHmac("sha256", secret).update(contenu).digest("base64url");
  return `${contenu}.${signature}`;
}

function sessionValide(jeton: string | undefined): boolean {
  const secret = sessionSecret();
  if (!secret || !jeton) return false;

  const parties = jeton.split(".");
  if (parties.length !== 2 || !/^\d{10}$/.test(parties[0]) || !/^[A-Za-z0-9_-]{43}$/.test(parties[1])) {
    return false;
  }

  const expiration = Number(parties[0]);
  const maintenant = Math.floor(Date.now() / 1000);
  if (expiration <= maintenant || expiration > maintenant + SESSION_MAX_AGE_SECONDS) return false;

  const signatureAttendue = createHmac("sha256", secret).update(parties[0]).digest();
  const signatureRecue = Buffer.from(parties[1], "base64url");
  return signatureRecue.length === signatureAttendue.length && timingSafeEqual(signatureAttendue, signatureRecue);
}

export async function sessionInfographeValide(): Promise<boolean> {
  const cookiesRequete = await cookies();
  return sessionValide(cookiesRequete.get(INFOGRAPHE_COOKIE)?.value);
}
