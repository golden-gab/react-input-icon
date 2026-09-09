import { getCustomIcon, type CustomIconComponent } from "./custom-icons"

export type ResolvedIcon =
  | { status: "iconify"; icon: string }
  | { status: "custom"; component: CustomIconComponent }
  | { status: "not-found"; ref: string }
  | { status: "invalid"; ref: string }

/**
 * Résout une référence "provider:name" :
 * - "lucide:coffee"   → iconify
 * - "heroicons:home"  → iconify
 * - "custom:my-logo"  → custom (si enregistré), else not-found
 * - format invalide   → invalid
 */
export function resolveIcon(ref: string): ResolvedIcon {
  const separatorIndex = ref.indexOf(":")
  if (separatorIndex === -1) return { status: "invalid", ref }

  const provider = ref.slice(0, separatorIndex)
  const name = ref.slice(separatorIndex + 1)
  if (!provider || !name) return { status: "invalid", ref }

  if (provider === "custom") {
    const component = getCustomIcon(name)
    return component ? { status: "custom", component } : { status: "not-found", ref }
  }

  // lucide, heroicons, ou tout autre prefix Iconify valide → délégué à Iconify
  return { status: "iconify", icon: ref }
}

/** Extrait le provider d'une référence, ex: "lucide:coffee" → "lucide" */
export function getProviderFromRef(ref: string): string {
  const separatorIndex = ref.indexOf(":")
  return separatorIndex === -1 ? "" : ref.slice(0, separatorIndex)
}