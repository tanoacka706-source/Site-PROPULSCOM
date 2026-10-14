# Site vitrine Propuls Com

Site vitrine de l'agence de communication et d'événementiel Propuls Com (Marcory, Abidjan), réalisé à partir du rapport de stage.
**Next.js 16 (App Router) · TypeScript · Tailwind CSS 3 · Supabase (PostgreSQL) · Vercel**

## Ce que fait le site

| Page | Rôle |
|---|---|
| `/` | Accueil : accroche, services, déroulement d'une création, réalisations |
| `/services` | Les six services de l'agence |
| `/realisations` | Portfolio avec filtres par type de support |
| `/modeles` | Catalogue : le client choisit jusqu'à 5 modèles qui l'inspirent |
| `/demande` | Formulaire de demande de création (enregistré dans Supabase) |
| `/contact` | Adresse, plan, WhatsApp, e-mail |

Le déroulement affiché (demande → maquette → retour du client → version finale) suit le modèle conceptuel des traitements du rapport.

## Démarrer en local

```bash
npm install
cp .env.example .env.local     # puis renseigner les valeurs (voir plus bas)
npm run dev                    # http://localhost:3000
```

Sans Supabase, le site s'affiche normalement ; seul l'envoi du formulaire répond « indisponible ».

## 1. Brancher Supabase (enregistrement des demandes)

1. Créer un projet sur supabase.com.
2. **SQL Editor** : coller et exécuter `supabase/schema.sql`.
3. **Project Settings > API** : copier l'URL du projet et la clé `service_role` dans `.env.local` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).

La clé `service_role` reste côté serveur (route `src/app/api/demandes/route.ts`). Les tables ont la sécurité par ligne (RLS) activée **sans aucune politique** : les clés publiques ne donnent accès à rien.
Chaque demande reçoit un numéro du type `PC-2610-K7M4`. Les demandes se consultent dans Supabase > Table Editor > `demande`.

## 2. Renseigner les informations de l'agence

Dans `.env.local` (et dans les variables d'environnement de Vercel) :

- `NEXT_PUBLIC_WHATSAPP` : numéro avec indicatif, sans `+` (ex. `2250700000000`). Tant qu'il est vide, les boutons WhatsApp n'apparaissent pas.
- `NEXT_PUBLIC_CONTACT_EMAIL` : adresse affichée sur le site.
- `NEXT_PUBLIC_SITE_URL` : adresse finale du site (sitemap et métadonnées).
- Facultatif : `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` pour recevoir un e-mail à chaque demande.

## 3. Remplacer les contenus d'exemple

Les réalisations et les modèles actuels sont des **visuels d'exemple générés** (mention « Visuel d'exemple » affichée). À remplacer par les vrais travaux :

1. Déposer les images dans `public/realisations/` et `public/modeles/` (format WebP, environ 1200 px de large).
2. Dans `src/data/realisations.ts` et `src/data/modeles.ts`, renseigner `image` (ex. `"/realisations/affiche-concert.webp"`) et `alt` (description de l'image). La mention disparaît d'elle-même.
3. Pour ajouter un modèle : nouvelle ligne dans `MODELES` avec un `slug` unique (il est enregistré avec chaque demande).

Les textes des services sont dans `src/data/services.ts`.

## 4. Logo et couleurs

- **Logo** : `public/logo-propulscom.png` (en-tête, détouré sur fond transparent). Le fichier fourni est de petite taille : pour un rendu plus net (grands écrans, impression), remplacer ce fichier par une version haute définition ou vectorielle, en gardant le même nom.
- **Sphère** : `src/components/Sphere.tsx` est une version **redessinée en vecteur** de la sphère du logo (accueil, pied de page, icône du site). Ce n'est pas le fichier d'origine de l'agence ; l'ajuster ou la remplacer si un fichier vectoriel officiel est disponible.
- **Couleurs** : tirées du logo (bleu marine, orange, corail, gris). Elles se changent à un seul endroit : les variables `--c-*` en haut de `src/app/globals.css`.
- **Polices** : Bricolage Grotesque et Instrument Sans, installées via npm (aucun appel à Google Fonts).
- **Icône du site et image de partage** (aperçu des liens WhatsApp) : `src/app/icon.svg`, `src/app/apple-icon.png` et `src/app/opengraph-image.png`.

## 5. Déployer sur Vercel

1. Pousser le dossier sur GitHub.
2. Sur vercel.com : *Add New > Project*, importer le dépôt (aucune configuration de build n'est nécessaire).
3. Ajouter les variables d'environnement du `.env.example`, puis déployer.

## Correspondance avec le MCD du rapport

| Rapport (Merise) | Base Supabase |
|---|---|
| CLIENT | `client` (téléphone unique) |
| MODELE | `modele` (+ `slug` pour relier le site) |
| DEMANDE | `demande` (statut, numéro `num_dem`) |
| INSPIRER | `inspirer` (demande ↔ modèles) |
| INFOGRAPHE | `infographe` |
| MAQUETTE | `maquette` (rattachée à la demande et à l'infographe, version et statut) |

Écart assumé avec le MLD du rapport : la clé étrangère de la maquette pointe vers la demande plutôt que vers le client, ce qui évite de redéduire de quelle demande provient une maquette. Les tables `infographe` et `maquette` sont prêtes mais **non utilisées par le site** (voir ci-dessous).

## Limites actuelles

- Pas encore d'espace de suivi pour le client (valider une maquette, demander une modification) ni d'espace d'administration pour l'équipe : ce sont les prochaines étapes naturelles, la base est déjà prévue pour.
- La limite anti-abus du formulaire est en mémoire : elle freine les abus, sans être absolue sur Vercel.
- Aucun envoi de fichier (logo, document) dans le formulaire pour l'instant.

## Sécurité en bref

Validation des données côté client et côté serveur (Zod), champ piège anti-robots, limitation du nombre d'envois par adresse IP, taille de requête bornée, en-têtes de sécurité HTTP, échappement des données dans l'e-mail de notification, clé Supabase privée jamais exposée au navigateur.
