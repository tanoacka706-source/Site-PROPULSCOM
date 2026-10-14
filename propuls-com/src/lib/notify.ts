import type { DemandeValidee } from "./validation";

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Prévient l'agence par e-mail (Resend). Ne fait rien si les variables ne sont pas renseignées. */
export async function notifierAgence(numDem: string, d: DemandeValidee): Promise<void> {
  const cle = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM;
  if (!cle || !to || !from) return;

  const ligne = (label: string, valeur?: string) =>
    valeur ? `<p><strong>${label} :</strong> ${echapper(valeur)}</p>` : "";

  const html = [
    `<h2>Nouvelle demande ${echapper(numDem)}</h2>`,
    ligne("Client", `${d.prenom} ${d.nom}`),
    ligne("Téléphone", d.contact),
    ligne("E-mail", d.email),
    ligne("Support", d.typeSupport),
    ligne("Format", d.format),
    ligne("Style et couleurs", d.style),
    ligne("Délai souhaité", d.delai),
    ligne("Modèles choisis", d.modeles.join(", ")),
    `<p><strong>Description :</strong></p><p>${echapper(d.description).replace(/\n/g, "<br>")}</p>`,
  ].join("");

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject: `Nouvelle demande ${numDem}`, html }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (e) {
    console.error("Notification e-mail non envoyée", e);
  }
}
