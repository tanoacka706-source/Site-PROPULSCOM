import type { ReactNode } from "react";

/** En-tête de page intérieure : titre et phrase d'introduction. */
export function TitrePage({ titre, intro, children }: { titre: string; intro: string; children?: ReactNode }) {
  return (
    <section className="border-b border-line">
      <div className="container-x py-14 md:py-20">
        <h1 className="display max-w-[16ch]">{titre}</h1>
        <p className="lead mt-6">{intro}</p>
        {children}
      </div>
    </section>
  );
}
