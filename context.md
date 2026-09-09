# context.md — react-input-icon

> Ce fichier sert de contexte complet pour reprendre ce projet avec une autre IA (ou après une pause). Il contient l'objectif, les décisions d'architecture, le scope volontairement limité, et l'état d'avancement.

---

## 1. Objectif du projet

Construire un **système de sélection et de rendu d'icônes pour React**, composé de :

- un **hook** `useIconPicker()` : logique pure de recherche/sélection, sans dépendance UI
- un composant **`<IconPicker />`** : UI de sélection (bouton → popup)
- un composant **`<IconRenderer />`** : affichage d'une icône à partir d'une référence stockée
- une **référence d'icône normalisée et persistable** (string, pas de JSON), du type :
  ```
  lucide:coffee
  heroicons:academic-cap
  custom:mon-logo
  ```

**Ce n'est pas un projet commercial.** L'objectif est un projet open-source / dev-tool propre, bien architecturé, pas un MVP monétisable. La qualité de conception prime sur la vitesse de livraison — mais le scope est volontairement contraint pour rester réalisable en **1 jour, 2 jours maximum**.

### Projets de référence à dépasser
- https://modall.ca/lab/shadcn-icon-picker-component — approche `useIconPicker()` + `<IconRenderer />`, mais lookup direct sur une seule lib (Heroicons), recherche par `includes()` basique, pas d'abstraction multi-provider.
- https://github.com/alan-crts/shadcn-iconpicker — approche shadcn registry (bon réflexe de livraison), mais couplé à Lucide uniquement, infinite scroll simple.

---

## 2. Décisions d'architecture clés

### 2.1 Ne pas construire un registry/resolver générique maison
Le problème "référencer une icône de façon universelle peu importe la lib source" est **déjà résolu par Iconify** (`@iconify/react`), qui unifie 200+ icon sets avec la convention `prefix:name`. On délègue toute la résolution multi-provider à Iconify plutôt que de la réinventer.

Notre `IconRenderer` est donc un **wrapper mince** autour d'Iconify, avec en plus la gestion d'un provider `custom:*` pour les SVG maison.

### 2.2 Référence d'icône = string, pas d'objet
Stockage en base : `"lucide:coffee"` (string simple), pas `{ provider: "lucide", name: "coffee" }`. Plus simple à sérialiser, à stocker, à transporter dans une API JSON.

### 2.3 Séparation stricte des responsabilités
```
useIconPicker()  → logique pure (query, filteredIcons, selectedIcon, select(), clear())
<IconPicker />   → une seule implémentation UI par défaut (Popover + Command shadcn)
<IconRenderer /> → résolution + affichage, doit fonctionner en Server Component
```
Le hook ne connaît ni la DB, ni le renderer, ni l'UI. Quelqu'un doit pouvoir faire `useIconPicker()` et brancher sa propre UI dessus.

### 2.4 Composition plutôt que configuration
On évite le piège des 40 props de customisation (`popupClassName`, `itemClassName`, etc.). On privilégie composition + CSS variables/Tailwind + shadcn. Cohérent avec le style "copy this component into your project" plutôt que package npm opaque.

### 2.5 Mode de livraison : shadcn registry (probable), pas package npm
Pas encore tranché définitivement, mais orientation actuelle : livrer comme composants copiables (style shadcn) plutôt qu'un package npm versionné, pour rester dans l'esprit "totalement personnalisable par celui qui l'utilise" et éviter la maintenance d'un package.

---

## 3. Scope v1 — ce qui est INCLUS

1. `resolveIcon(ref: string)` — wrapper Iconify + fallback pour `custom:*`
2. `<IconRenderer icon="lucide:coffee" />` — gère icône manquante (fallback silencieux + warning en dev), accepte props SVG standards, fonctionne en Server Component
3. `useIconPicker({ providers, query, onSelect })` — état pur, recherche fuzzy via `fuse.js`
4. `<IconPicker />` — UNE seule implémentation par défaut : Popover + Command (shadcn/ui)
5. Providers supportés : **Lucide + Heroicons** (via Iconify) + provider **`custom`** pour SVG maison
6. Recherche fuzzy simple sur le nom de l'icône (fuse.js), pas de tags sémantiques
7. README avec exemples d'usage

## 4. Scope v1 — ce qui est EXCLU (volontairement, pour tenir le délai)

- ❌ Catégories/taxonomie d'icônes (curation manuelle trop coûteuse en temps)
- ❌ Recherche par tags sémantiques (ex: "restaurant" → Utensils, ChefHat...) — nécessite un dataset de tags à construire/maintenir
- ❌ Virtualisation de la grille (à ajouter seulement si un besoin réel de perf est mesuré — Lucide ~1500 icônes, pas 50 000)
- ❌ Mode `dialog` alternatif au Popover — une seule UI par défaut pour l'instant
- ❌ Site dédié avec landing page + démo live interactive — un repo GitHub + README suffit pour l'instant
- ❌ Support générique "tout provider imaginable" — seulement Lucide + Heroicons + custom

> Si le projet évolue après la v1, ces points peuvent être réintroduits, mais ils ne doivent pas bloquer la livraison initiale.

---

## 5. Stack technique

- **Build tool** : Vite (template `react-ts`)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4 (`@tailwindcss/vite`)
- **Composants UI** : shadcn/ui (composants installés : `popover`, `command`, `button`)
- **Résolution d'icônes** : `@iconify/react`
- **Recherche fuzzy** : `fuse.js`
- **Package manager** : npm

### Alias configuré
`@/*` → `./src/*` (requis par shadcn, configuré dans `tsconfig.json` + `vite.config.ts` via `path.resolve`)

---

## 6. Roadmap (6 étapes, ~6-7h de travail effectif)

| # | Étape | Contenu | Statut |
|---|-------|---------|--------|
| 1 | **Setup** | Projet Vite+TS+Tailwind+shadcn+Iconify+Fuse.js | ✅ Terminé |
| 2 | **Resolver + Renderer** | `resolveIcon(ref)` + `<IconRenderer />` avec fallback | ⏳ À faire |
| 3 | **Hook `useIconPicker()`** | État pur, fuzzy search, select/clear | ⏳ À faire |
| 4 | **`<IconPicker />`** | UI Popover + Command branchée sur le hook | ⏳ À faire |
| 5 | **Custom icons** | Provider `custom` pour SVG maison | ⏳ À faire |
| 6 | **Finition** | README, accessibilité clavier, vérif SSR | ⏳ À faire |

---

## 7. État actuel du projet

**Dernière étape complétée : Étape 1 (Setup)**

Commandes exécutées :
```bash
npm create vite@latest react-input-icon -- --template react-ts
npm install
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node
npx shadcn@latest init
npx shadcn@latest add popover command button
npm install @iconify/react fuse.js
```

Configuration appliquée :
- `vite.config.ts` : plugin Tailwind + alias `@` → `./src`
- `src/index.css` : `@import "tailwindcss";`
- `tsconfig.json` / `tsconfig.app.json` : `baseUrl` + `paths` pour `@/*`

**Prochaine étape à exécuter : Étape 2 — `resolveIcon()` + `<IconRenderer />`**

---

## 8. Principes à respecter pour toute IA reprenant ce projet

1. **Ne pas réintroduire le scope exclu** (section 4) sans validation explicite de l'utilisateur.
2. **Ne pas coder plusieurs étapes d'un coup** — avancer étape par étape, valider avant de continuer.
3. **Composition > configuration** — résister à la tentation d'ajouter des props de customisation en masse.
4. **Le hook reste pur** — ne jamais lui faire connaître la DB, le renderer ou l'UI.
5. Le renderer doit rester **utilisable en Server Component** (pas de hooks React dans `resolveIcon`/`IconRenderer` sauf si strictement nécessaire côté client).