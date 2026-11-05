"use client";

import { useActionState } from "react";
import { seConnecter, type EtatConnexion } from "./actions";

export function ConnexionInfographe() {
  const [etat, action, envoi] = useActionState<EtatConnexion, FormData>(seConnecter, null);

  return (
    <main className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <section className="w-full max-w-md rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-bleu">Espace de travail</p>
        <h1 className="h2 mt-3">Connexion infographe</h1>
        <p className="mt-3 text-muted">Connectez-vous pour consulter les demandes de création reçues.</p>

        <form action={action} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block font-medium">Adresse e-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block font-medium">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={1024}
              className="field"
            />
          </div>
          {etat?.erreur && (
            <p role="alert" className="rounded-md bg-corail/10 p-3 text-sm text-corail">
              {etat.erreur}
            </p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={envoi}>
            {envoi ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </section>
    </main>
  );
}
