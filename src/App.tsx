import { useState } from "react"
import { IconPicker } from "@/components/icon-picker"
import { registerCustomIcon } from "@/lib/custom-icons"

function MyLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" />
    </svg>
  )
}
registerCustomIcon("my-logo", MyLogo)

export default function App() {
  const [icon, setIcon] = useState("")

  return (
    <div className="p-8 space-y-2">
      <IconPicker value={icon} onChange={setIcon}  />
      <p>Valeur stockée : <code>{icon || "aucune"}</code></p>
    </div>
  )
}