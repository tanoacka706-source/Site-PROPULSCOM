export type Etape = { titre: string; texte: string; encre: "bleu" | "orange" | "corail" | "ink" };

// Le déroulement suit le modèle conceptuel des traitements du rapport : demande, maquette, retour du client, version finale.
export const ETAPES: Etape[] = [
  {
    titre: "Vous décrivez votre besoin",
    texte: "Choisissez un ou plusieurs modèles qui vous plaisent et remplissez la demande en quelques minutes.",
    encre: "bleu",
  },
  {
    titre: "Nous réalisons la maquette",
    texte: "Votre demande est transmise à l’infographe, qui prépare une première version de votre support.",
    encre: "orange",
  },
  {
    titre: "Vous validez ou vous demandez des changements",
    texte: "Vous nous faites votre retour. Nous ajustons la maquette autant de fois que nécessaire.",
    encre: "corail",
  },
  {
    titre: "Nous livrons la version finale",
    texte: "Une fois la maquette validée, nous produisons la version finale et vous l’envoyons.",
    encre: "ink",
  },
];
