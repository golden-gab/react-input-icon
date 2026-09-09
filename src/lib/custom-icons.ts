import type { ComponentType, SVGProps } from "react"

export type CustomIconComponent = ComponentType<SVGProps<SVGSVGElement>>

const customIcons = new Map<string, CustomIconComponent>()

/** Register a custom unique icon. */
export function registerCustomIcon(name: string, component: CustomIconComponent) {
  customIcons.set(name, component)
}

/** Register many icons at the same time */
export function registerCustomIcons(icons: Record<string, CustomIconComponent>) {
  for (const [name, component] of Object.entries(icons)) {
    customIcons.set(name, component)
  }
}

export function getCustomIcon(name: string): CustomIconComponent | undefined {
  return customIcons.get(name)
}

export function listCustomIconNames(): string[] {
  return Array.from(customIcons.keys())
}