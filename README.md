# Direction artistique — explorateur de style

Application **Next.js 14** (App Router, TypeScript, Tailwind CSS, Framer Motion), **frontend uniquement** : choix de typographies et de couleurs avec aperçu en direct, comme le prototype HTML fourni. Aucune base de données ni API : le bouton « Envoyer » affiche un récapitulatif à l’écran (aucune donnée n’est transmise à un serveur).

## Prérequis

- Node.js 18+

## Développement

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Déploiement Vercel

1. Crée un dépôt GitHub et pousse ce dossier comme racine du dépôt (ou définis **Root Directory** sur `DIRECTION-ARTISTIQUE-GLOBAL` si le dépôt est le monorepo parent).
2. Sur [vercel.com](https://vercel.com), **Import Project** → choisis le dépôt.
3. Framework : **Next.js** (détecté automatiquement). Aucune variable d’environnement requise.
4. Déploie : la page d’accueil est entièrement statique après build.

## Structure

- `app/page.tsx` — page unique
- `components/StyleExplorer.tsx` — logique et UI de l’explorateur
- `components/explorer.css` — styles du prototype (préfixe `da-` pour limiter les collisions)
- `lib/explorer-data.ts` — familles de polices, palettes, URL Google Fonts

Les polices d’aperçu sont chargées via la feuille Google Fonts dans `app/layout.tsx`.
