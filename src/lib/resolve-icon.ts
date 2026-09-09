import { getCustomIcon, type CustomIconComponent } from "./custom-icons"

export type ResolvedIcon =
  | { status: "iconify"; icon: string }
  | { status: "custom"; component: CustomIconComponent }
  | { status: "not-found"; ref: string }
  | { status: "invalid"; ref: string }

/**
 * Resolves a "provider:name" reference:
 * - "lucide:coffee"   → iconify
 * - "heroicons:home"  → iconify
 * - "custom:my-logo"  → custom (if registered), else not-found
 * - invalid format    → invalid
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

  // lucide, heroicons, or any other valid Iconify prefix → delegated to Iconify
  return { status: "iconify", icon: ref }
}

/** Extracts the provider from a reference, e.g. "lucide:coffee" → "lucide" */
export function getProviderFromRef(ref: string): string {
  const separatorIndex = ref.indexOf(":")
  return separatorIndex === -1 ? "" : ref.slice(0, separatorIndex)
}
