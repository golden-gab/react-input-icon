import { Icon as IconifyIcon } from "@iconify/react"
import type { ReactNode, SVGProps } from "react"
import { resolveIcon } from "@/lib/resolve-icon"

type IconRendererSvgProps = Omit<
  SVGProps<SVGSVGElement>,
  "ref" | "mode" | "onLoad" | "rotate" | "width" | "height"
>

export interface IconRendererProps
  extends IconRendererSvgProps {
  /** Reference: "lucide:coffee", "heroicons:home", "custom:my-logo" */
  icon: string
  /** Rendered when the icon is not found or the format is invalid. */
  fallback?: ReactNode
  /** Shorthand that sets both width and height. Explicit width/height win. */
  size?: string | number
  width?: string | number
  height?: string | number
}

export function IconRenderer({
  icon,
  fallback = null,
  size,
  ...props
}: IconRendererProps) {
  const resolved = resolveIcon(icon)
  const dimensions = size === undefined ? {} : { width: size, height: size }

  if (resolved.status === "iconify") {
    return <IconifyIcon icon={resolved.icon} {...dimensions} {...props} />
  }

  if (resolved.status === "custom") {
    const Component = resolved.component
    return <Component {...dimensions} {...props} />
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[IconRenderer] Icon "${icon}" ${
        resolved.status === "invalid" ? "invalid (expected format: provider:name)" : "not found"
      }.`
    )
  }

  return <>{fallback}</>
}
