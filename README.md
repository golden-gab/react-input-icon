# react-input-icon

Un système composable de sélection et de rendu d'icônes pour React — pas un package npm, mais des composants à copier directement dans ton projet (esprit shadcn/ui).

Choisis une icône depuis Lucide, Heroicons, ou tes propres SVG, stocke une simple référence texte (`"lucide:coffee"`), et affiche-la n'importe où avec `<IconRenderer />`.

## Pourquoi

- **Une référence, plusieurs sources** : `"lucide:coffee"`, `"heroicons:home"`, `"custom:mon-logo"` — un format unique stocké en base, peu importe d'où vient l'icône.
- **Composable, pas configurable à l'excès** : trois briques indépendantes (`resolveIcon`, `useIconPicker`, `<IconPicker />`) que tu peux recombiner à ta façon plutôt qu'un composant à 40 props.
- **Zéro dépendance cachée à l'exécution** : les catalogues d'icônes sont bundlés localement (`@iconify-json/*`), pas d'appel réseau pour lister les icônes.

## Prérequis

- React + TypeScript
- Tailwind CSS
- shadcn/ui (base **Base UI**)

## Installation

```bash
npm install @iconify/react @iconify-json/lucide @iconify-json/heroicons fuse.js
npx shadcn@latest add popover command button skeleton
```

Puis copie les fichiers suivants dans ton projet :

```
src/lib/custom-icons.ts
src/lib/resolve-icon.ts
src/lib/icon-catalog.ts
src/hooks/use-icon-picker.ts
src/components/icon-renderer.tsx
src/components/icon-picker.tsx
```

## Démarrage rapide

```tsx
import { useState } from "react"
import { IconPicker } from "@/components/icon-picker"

export default function Example() {
  const [icon, setIcon] = useState("lucide:coffee")

  return <IconPicker value={icon} onChange={setIcon} />
}
```

`icon` est une simple string (`"lucide:coffee"`) — c'est exactement ce que tu stockes en base de données.

## `<IconRenderer />`

Affiche une icône à partir de sa référence.

```tsx
import { IconRenderer } from "@/components/icon-renderer"

<IconRenderer icon="lucide:coffee" />
<IconRenderer icon="heroicons:home" />
<IconRenderer icon="heroicons:academic-cap-solid" />
<IconRenderer icon="custom:mon-logo" />

// Icône introuvable ou référence invalide → fallback
<IconRenderer icon="lucide:icone-inexistante" fallback={<span>?</span>} />
```

Props disponibles : `className`, `style`, `width`, `height`, `color`, `onClick`, `aria-hidden`, `aria-label`, `fallback`.

## Icônes personnalisées

Enregistre tes propres composants SVG avant de les référencer :

```tsx
import { registerCustomIcon, registerCustomIcons } from "@/lib/custom-icons"

function MonLogo(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" {...props}>...</svg>
}

registerCustomIcon("mon-logo", MonLogo)

// ou plusieurs à la fois
registerCustomIcons({
  "mon-logo": MonLogo,
  "autre-icone": AutreIcone,
})
```

Ensuite : `<IconRenderer icon="custom:mon-logo" />`.

## `useIconPicker()`

Logique pure de recherche/sélection, sans dépendance UI. Utile si tu veux construire ta propre interface de sélection.

```tsx
import { useIconPicker } from "@/hooks/use-icon-picker"

const {
  query,           // texte de recherche actuel
  setQuery,        // met à jour la recherche
  filteredIcons,   // résultats filtrés (fuzzy search + provider actifs)
  selectedIcon,    // référence sélectionnée
  select,          // sélectionne une icône
  clear,           // réinitialise la sélection
  providers,       // liste des providers configurés
  activeProviders, // providers actuellement affichés
  toggleProvider,  // active/désactive un provider
} = useIconPicker({
  providers: ["lucide", "heroicons", "custom"], // défaut: ["lucide", "heroicons"]
  initialValue: "lucide:coffee",
  maxResults: 60,
})
```

## `<IconPicker />`

L'interface par défaut : un bouton qui ouvre un popover avec recherche, filtres par provider, et grille d'icônes.

```tsx
<IconPicker
  value={icon}
  onChange={setIcon}
  providers={["lucide", "heroicons", "custom"]}
  placeholder="Choisir une icône"
/>
```

Les badges de filtrage par provider n'apparaissent que si plusieurs providers sont configurés.

## Accessibilité

Basé sur `Popover` et `Command` (shadcn/ui + Base UI) : navigation clavier complète, gestion du focus, `Escape` pour fermer — géré nativement, rien à ajouter. Les badges de filtre par provider exposent leur état via `aria-pressed`.

## Limites connues (scope volontaire)

- Pas de catégories/taxonomie d'icônes
- Pas de recherche par tags sémantiques (uniquement sur le nom)
- Pas de virtualisation de la grille (inutile à l'échelle de Lucide + Heroicons)
- Providers supportés : Lucide, Heroicons, + tes icônes custom

## Stack

Vite · React · TypeScript · Tailwind CSS · shadcn/ui (Base UI) · Iconify · Fuse.js