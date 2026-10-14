import Link from "next/link";

export default function NonTrouvee() {
  return (
    <section className="container-x py-24">
      <h1 className="display max-w-[14ch]">Page introuvable</h1>
      <p className="lead mt-6">L’adresse demandée n’existe pas ou a été déplacée.</p>
      <Link href="/" className="btn-primary mt-8">
        Retour à l’accueil
      </Link>
    </section>
  );
}
