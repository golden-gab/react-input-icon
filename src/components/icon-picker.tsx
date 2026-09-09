import { useState, type ReactNode } from "react";
import {
    useIconPicker,
    type UseIconPickerOptions,
} from "@/hooks/use-icon-picker";
import { providerLabels } from "@/lib/icon-catalog";
import { IconRenderer } from "@/components/icon-renderer";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface IconPickerProps
    extends Pick<UseIconPickerOptions, "providers" | "maxResults"> {
    /** Selected icon reference (controlled mode). */
    value?: string;
    /** Initial icon reference when the picker is uncontrolled. */
    defaultValue?: string;
    /** Called when an icon is selected. */
    onChange?: (icon: string) => void;
    /** Popover open state (controlled mode). */
    open?: boolean;
    /** Initial popover open state when uncontrolled. */
    defaultOpen?: boolean;
    /** Called when the popover opens or closes. */
    onOpenChange?: (open: boolean) => void;
    /** Disables the trigger button. */
    disabled?: boolean;
    /** Label used as the trigger's aria-label when no icon is selected. */
    placeholder?: string;
    /** Placeholder shown in the search input. */
    searchPlaceholder?: string;
    /** Content shown when no icon matches the current query. */
    emptyContent?: ReactNode;
    /** Extra classes for the trigger button. */
    triggerClassName?: string;
    /** Extra classes for the popover content. */
    contentClassName?: string;
    /** Extra classes for the search input. */
    inputClassName?: string;
    /** Extra classes for the icon grid. */
    gridClassName?: string;
    /** Extra classes applied to every icon in the grid. */
    iconClassName?: string;
}

export function IconPicker({
    value,
    defaultValue = "",
    onChange,
    open,
    defaultOpen = false,
    onOpenChange,
    disabled,
    providers,
    maxResults,
    placeholder = "Choose an icon",
    searchPlaceholder = "Search icons...",
    emptyContent = "No icons found.",
    triggerClassName,
    contentClassName,
    inputClassName,
    gridClassName,
    iconClassName,
}: IconPickerProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const {
        query,
        setQuery,
        filteredIcons,
        selectedIcon,
        select,
        providers: allProviders,
        activeProviders,
        toggleProvider,
    } = useIconPicker({
        providers,
        initialValue: value ?? defaultValue,
        maxResults,
    });

    const isOpen = open ?? internalOpen;
    const current = value ?? selectedIcon;

    function handleOpenChange(nextOpen: boolean) {
        setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
    }

    function handleSelect(ref: string) {
        select(ref);
        onChange?.(ref);
        handleOpenChange(false);
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        className={cn("h-9", triggerClassName)}
                        aria-label={placeholder}
                        disabled={disabled}
                    />
                }
            >
                {current ? (
                    <>
                        <IconRenderer icon={current} />
                        <span>{current}</span>
                    </>
                ) : (
                    <span className="text-muted-foreground text-xs">{placeholder}</span>
                )}
            </PopoverTrigger>

            <PopoverContent
                className={cn("w-72 p-0", contentClassName)}
                align="start"
            >
                <Command shouldFilter={false}>
                    <CommandInput
                        className={inputClassName}
                        placeholder={searchPlaceholder}
                        value={query}
                        onValueChange={setQuery}
                    />

                    {allProviders.length > 1 && (
                        <div className="flex gap-1.5 overflow-x-auto px-2 py-2 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {allProviders.map((provider) => {
                                const active =
                                    activeProviders.includes(provider);
                                return (
                                    <button
                                        key={provider}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => toggleProvider(provider)}
                                        className={cn(
                                            "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                                            active
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/70",
                                        )}
                                    >
                                        {providerLabels[provider]}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <CommandList>
                        <CommandEmpty>{emptyContent}</CommandEmpty>
                        <CommandGroup
                            className={cn(
                                "**:[[cmdk-group-items]]:grid **:[[cmdk-group-items]]:grid-cols-6 **:[[cmdk-group-items]]:gap-1 **:[[cmdk-group-items]]:p-2",
                                gridClassName,
                            )}
                        >
                            {filteredIcons.map((icon) => (
                                <CommandItem
                                    key={icon.ref}
                                    value={icon.ref}
                                    onSelect={() => handleSelect(icon.ref)}
                                    className="flex aspect-square items-center justify-center rounded-md p-2 cursor-pointer [&_svg.ml-auto]:hidden"
                                >
                                    <IconRenderer
                                        icon={icon.ref}
                                        className={cn("h-5 w-5", iconClassName)}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
