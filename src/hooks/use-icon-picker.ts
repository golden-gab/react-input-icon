import { useMemo, useState } from "react"
import Fuse from "fuse.js"
import { getIconCatalog, type IconDefinition, type IconProvider } from "@/lib/icon-catalog"
import { getProviderFromRef } from "@/lib/resolve-icon"

export interface UseIconPickerOptions {
  providers?: IconProvider[]
  initialValue?: string
  maxResults?: number
}

export function useIconPicker(options: UseIconPickerOptions = {}) {
  const { providers = ["lucide", "heroicons"], initialValue = "", maxResults = 60 } = options

  const [query, setQuery] = useState("")
  const [selectedIcon, setSelectedIcon] = useState(initialValue)
  const [activeProviders, setActiveProviders] = useState<IconProvider[]>(providers)

  const catalog = useMemo(() => getIconCatalog(providers), [providers.join(",")])

  const fuse = useMemo(
    () => new Fuse(catalog, { keys: ["label", "ref"], threshold: 0.4 }),
    [catalog]
  )

  const filteredIcons = useMemo<IconDefinition[]>(() => {
    const base = query.trim() ? fuse.search(query).map((result) => result.item) : catalog
    const scoped = base.filter((icon) =>
      activeProviders.includes(getProviderFromRef(icon.ref) as IconProvider)
    )
    return scoped.slice(0, maxResults)
  }, [query, fuse, catalog, activeProviders, maxResults])

  function toggleProvider(provider: IconProvider) {
    setActiveProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]
    )
  }

  return {
    query,
    setQuery,
    filteredIcons,
    selectedIcon,
    select: setSelectedIcon,
    clear: () => setSelectedIcon(""),
    providers,
    activeProviders,
    toggleProvider,
  }
}