import { Icon as IconifyIcon } from "@iconify/react"
import type { CSSProperties, MouseEventHandler, ReactNode } from "react"
import { resolveIcon } from "@/lib/resolve-icon"

export interface IconRendererProps {
  /** Référence : "lucide:coffee", "heroicons:home", "custom:my-logo" */
  icon: string
  /** Affiché si l'icône est introuvable ou le format invalide. */
  fallback?: ReactNode
  className?: string
  style?: CSSProperties
  width?: string | number
  height?: string | number
  color?: string
  onClick?: MouseEventHandler<SVGElement>
  "aria-hidden"?: boolean
  "aria-label"?: string
}

export function IconRenderer({ icon, fallback = null, ...props }: IconRendererProps) {
  const resolved = resolveIcon(icon)

  if (resolved.status === "iconify") {
    return <IconifyIcon icon={resolved.icon} {...props} />
  }

  if (resolved.status === "custom") {
    const Component = resolved.component
    return <Component {...props} />
  }

  if (import.meta.env.DEV) {
    console.warn(
      `[IconRenderer] Icône "${icon}" ${
        resolved.status === "invalid" ? "invalide (format attendu: provider:name)" : "introuvable"
      }.`
    )
  }

  return <>{fallback}</>
}