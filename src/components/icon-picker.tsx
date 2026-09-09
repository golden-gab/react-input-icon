import { useState } from "react";
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

export interface IconPickerProps extends Pick<
    UseIconPickerOptions,
    "providers"
> {
    value?: string;
    onChange?: (icon: string) => void;
    placeholder?: string;
}

export function IconPicker({
    value,
    onChange,
    providers,
    placeholder = "Choisir une icône",
}: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const {
        query,
        setQuery,
        filteredIcons,
        selectedIcon,
        select,
        providers: allProviders,
        activeProviders,
        toggleProvider,
    } = useIconPicker({ providers, initialValue: value });

    const current = value ?? selectedIcon;

    function handleSelect(ref: string) {
        select(ref);
        onChange?.(ref);
        setOpen(false);
    }
    console.log(current);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        className="h-9 "
                        aria-label={placeholder}
                    />
                }
            >
                {current ? (
                    <>
                        <IconRenderer icon={current} />
                        <span>{current}</span>
                    </>
                ) : (
                    <span className="text-muted-foreground text-xs">?</span>
                )}
            </PopoverTrigger>

            <PopoverContent className="w-72 p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Rechercher une icône..."
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
                        <CommandEmpty>Aucune icône trouvée.</CommandEmpty>
                        <CommandGroup className="**:[[cmdk-group-items]]:grid **:[[cmdk-group-items]]:grid-cols-6 **:[[cmdk-group-items]]:gap-1 **:[[cmdk-group-items]]:p-2">
                            {filteredIcons.map((icon) => (
                                <CommandItem
                                    key={icon.ref}
                                    value={icon.ref}
                                    onSelect={() => handleSelect(icon.ref)}
                                    className="flex aspect-square items-center justify-center rounded-md p-2 cursor-pointer [&_svg.ml-auto]:hidden"
                                >
                                    <IconRenderer
                                        icon={icon.ref}
                                        className="h-5 w-5"
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
