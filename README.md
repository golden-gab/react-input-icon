# react-input-icon

A composable icon selection and rendering system for React, distributed as a shadcn registry component (styled in the spirit of shadcn/ui).

Choose an icon from Lucide, Heroicons, or your own SVGs, store a simple text reference (`"lucide:coffee"`), and display it anywhere with `<IconRenderer />`.

## Why

- **One reference, multiple sources**: `"lucide:coffee"`, `"heroicons:home"`, `"custom:mon-logo"` — one format stored in the database, no matter where the icon comes from.
- **Composable, not over-configured**: three independent building blocks (`resolveIcon`, `useIconPicker`, `<IconPicker />`) you can recombine your way rather than a 40-prop component.
- **Zero hidden runtime dependencies**: icon catalogs are bundled locally (`@iconify-json/*`), no network call to list icons.

## Prerequisites

- React + TypeScript
- Tailwind CSS
- A project already initialized with shadcn/ui (`npx shadcn@latest init`)

## Installation

```bash
npx shadcn@latest add golden-gab/react-input-icon/icon-picker
```

The CLI copies the picker, renderer, hook and helpers into your project:

```
components/icon-picker.tsx
components/icon-renderer.tsx
hooks/use-icon-picker.ts
lib/icon-catalog.ts
lib/resolve-icon.ts
lib/custom-icons.ts
```

It also installs the npm dependencies (`@iconify/react`, Iconify icon data sets, `fuse.js`) and the shadcn/ui base components used internally (`button`, `popover`, `command`) automatically.

## Quick start

```tsx
import { useState } from "react"
import { IconPicker } from "@/components/icon-picker"

export default function Example() {
  const [icon, setIcon] = useState("lucide:coffee")

  return <IconPicker value={icon} onChange={setIcon} />
}
```

`icon` is a plain string (`"lucide:coffee"`) — exactly what you store in the database.

## `<IconRenderer />`

Renders an icon from its reference.

```tsx
import { IconRenderer } from "@/components/icon-renderer"

<IconRenderer icon="lucide:coffee" />
<IconRenderer icon="heroicons:home" />
<IconRenderer icon="heroicons:academic-cap-solid" />
<IconRenderer icon="custom:mon-logo" />

// Icon not found or invalid reference → fallback
<IconRenderer icon="lucide:icone-inexistante" fallback={<span>?</span>} />
```

`IconRenderer` also forwards SVG props (`className`, `style`, `fill`, `strokeWidth`, `onClick`, `aria-label`, ...) to the underlying icon.

| Prop | Type | Description |
| --- | --- | --- |
| `icon` | `string` | Icon reference such as `"lucide:coffee"` or `"custom:mon-logo"`. |
| `fallback` | `ReactNode` | Rendered when the icon is not found or the reference is invalid. |
| `size` | `string \| number` | Shorthand that sets both `width` and `height`. Explicit `width`/`height` props take precedence. |

## Custom icons

Register your own SVG components before referencing them:

```tsx
import { registerCustomIcon, registerCustomIcons } from "@/lib/custom-icons"

function MonLogo(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" {...props}>...</svg>
}

registerCustomIcon("mon-logo", MonLogo)

// or several at once
registerCustomIcons({
  "mon-logo": MonLogo,
  "autre-icone": AutreIcone,
})
```

Then: `<IconRenderer icon="custom:mon-logo" />`.

## `useIconPicker()`

Pure search/selection logic with no UI dependency. Useful if you want to build your own selection interface.

```tsx
import { useIconPicker } from "@/hooks/use-icon-picker"

const {
  query,           // current search text
  setQuery,        // updates the search
  filteredIcons,   // filtered results (fuzzy search + active providers)
  selectedIcon,    // selected reference
  select,          // selects an icon
  clear,           // resets the selection
  providers,       // list of configured providers
  activeProviders, // providers currently displayed
  toggleProvider,  // enables/disables a provider
} = useIconPicker({
  providers: ["lucide", "heroicons", "custom"], // default: ["lucide", "heroicons"]
  initialValue: "lucide:coffee",
  maxResults: 60,
})
```

## `<IconPicker />`

The default interface: a button that opens a popover with search, provider filters, and an icon grid.

```tsx
<IconPicker
  value={icon}
  onChange={setIcon}
  providers={["lucide", "heroicons", "custom"]}
  placeholder="Choose an icon"
/>
```

Provider filter badges only appear when several providers are configured.

The picker is usable in both controlled and uncontrolled modes:

```tsx
// Uncontrolled
<IconPicker defaultValue="lucide:coffee" onChange={setIcon} />

// Controlled + customized
<IconPicker
  value={icon}
  onChange={setIcon}
  providers={["lucide", "heroicons", "custom"]}
  maxResults={30}
  disabled={saving}
  placeholder="Choose an icon"
  searchPlaceholder="Search icons..."
  emptyContent="No icon matches your search."
  triggerClassName="w-56 justify-between"
  contentClassName="w-80"
  iconClassName="size-6"
/>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Selected icon reference (controlled mode). |
| `defaultValue` | `string` | `""` | Initial icon reference (uncontrolled mode). |
| `onChange` | `(icon: string) => void` | — | Called when an icon is selected. |
| `open` | `boolean` | — | Popover open state (controlled mode). |
| `defaultOpen` | `boolean` | `false` | Initial popover open state (uncontrolled mode). |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the popover opens or closes. |
| `disabled` | `boolean` | `false` | Disables the trigger button. |
| `providers` | `IconProvider[]` | `["lucide", "heroicons"]` | Icon providers available in the picker. |
| `maxResults` | `number` | `60` | Maximum number of icons displayed. |
| `placeholder` | `string` | `"Choose an icon"` | Aria label of the trigger when no icon is selected. |
| `searchPlaceholder` | `string` | `"Search icons..."` | Placeholder of the search input. |
| `emptyContent` | `ReactNode` | `"No icons found."` | Content shown when the search returns no results. |
| `triggerClassName` | `string` | — | Extra classes for the trigger button. |
| `contentClassName` | `string` | — | Extra classes for the popover content. |
| `inputClassName` | `string` | — | Extra classes for the search input. |
| `gridClassName` | `string` | — | Extra classes for the icon grid. |
| `iconClassName` | `string` | — | Extra classes applied to every icon in the grid. |

## Accessibility

Built on `Popover` and `Command` (shadcn/ui + Base UI): full keyboard navigation, focus management, `Escape` to close — handled natively, nothing to add. Provider filter badges expose their state via `aria-pressed`.

## Known limitations (deliberate scope)

- No icon categories/taxonomy
- No semantic tag search (name only)
- No grid virtualization (unnecessary at the Lucide + Heroicons scale)
- Supported providers: Lucide, Heroicons, plus your custom icons

## Stack

Vite · React · TypeScript · Tailwind CSS · shadcn/ui (Base UI) · Iconify · Fuse.js
