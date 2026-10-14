import type { Metadata } from "next";
import { Suspense } from "react";
import { DemandeForm } from "@/components/DemandeForm";
import { TitrePage } from "@/components/Titre";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Demande de création",
  description: "Décrivez le support dont vous avez besoin : affiche, flyer, bannière, carte de visite ou contenu digital. Propuls Com vous répond avec une maquette.",
};

export default function Demande() {
  const wa = whatsappLink();
  return (
    <>
      <TitrePage titre="Demande de création" intro="Quelques informations suffisent pour que l’infographe puisse commencer. Vous pourrez ensuite valider la maquette ou demander des modifications." />
      <section className="container-x grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,640px)_1fr]">
        <Suspense fallback={<p className="text-muted">Chargement du formulaire…</p>}>
          <DemandeForm whatsapp={wa} whatsappSuccesBase={wa ? `${wa}?text=` : null} />
        </Suspense>
        <aside className="lg:pt-2" aria-labelledby="apres-titre">
          <h2 id="apres-titre" className="h3">
            Ensuite
          </h2>
          <ul className="mt-4 space-y-3 text-muted">
            <li>Vous recevez un numéro de demande à conserver.</li>
            <li>Notre équipe vous contacte pour confirmer votre besoin.</li>
            <li>L’infographe prépare la première maquette, que vous validez ou que nous modifions avec vous.</li>
          </ul>
        </aside>
      </section>
    </>
  );
}
