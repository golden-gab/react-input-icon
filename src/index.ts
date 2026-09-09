export {
  getCustomIcon,
  listCustomIconNames,
  registerCustomIcon,
  registerCustomIcons,
  type CustomIconComponent,
} from "./lib/custom-icons"

export {
  getProviderFromRef,
  resolveIcon,
  type ResolvedIcon,
} from "./lib/resolve-icon"

export {
  getIconCatalog,
  providerLabels,
  type IconDefinition,
  type IconProvider,
} from "./lib/icon-catalog"

export {
  useIconPicker,
  type UseIconPickerOptions,
} from "./hooks/use-icon-picker"

export {
  IconRenderer,
  type IconRendererProps,
} from "./components/icon-renderer"

export {
  IconPicker,
  type IconPickerProps,
} from "./components/icon-picker"
