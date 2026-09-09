import lucideData from "@iconify-json/lucide/icons.json"
import heroiconsData from "@iconify-json/heroicons/icons.json"
import { listCustomIconNames } from "./custom-icons"

export interface IconDefinition {
  ref: string    // "lucide:coffee"
  label: string  // "Coffee"
}

function toLabel(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const lucideCatalog: IconDefinition[] = Object.keys(lucideData.icons).map((name) => ({
  ref: `lucide:${name}`,
  label: toLabel(name),
}))

const heroiconsCatalog: IconDefinition[] = Object.keys(heroiconsData.icons).map((name) => ({
  ref: `heroicons:${name}`,
  label: toLabel(name),
}))

export type IconProvider = "lucide" | "heroicons" | "custom"

export function getIconCatalog(providers: IconProvider[] = ["lucide", "heroicons"]): IconDefinition[] {
  const catalog: IconDefinition[] = []
  if (providers.includes("lucide")) catalog.push(...lucideCatalog)
  if (providers.includes("heroicons")) catalog.push(...heroiconsCatalog)
  if (providers.includes("custom")) {
    catalog.push(
      ...listCustomIconNames().map((name) => ({ ref: `custom:${name}`, label: toLabel(name) }))
    )
  }
  return catalog
}

export const providerLabels: Record<IconProvider, string> = {
  lucide: "Lucide",
  heroicons: "Heroicons",
  custom: "Custom",
}
