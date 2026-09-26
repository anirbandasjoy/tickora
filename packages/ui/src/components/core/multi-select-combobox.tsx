"use client";

import { ChevronsUpDown, X } from "lucide-react";
import * as React from "react";
import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { SelectTriggerProps } from "./select";
import type { Option } from "./multi-select";

export interface MultiSelectComboboxProps {
  ref?: React.ForwardedRef<HTMLButtonElement>;
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  selectedLabel?: (count: number) => string;
  /** Optional leading icon rendered inside the trigger */
  icon?: ReactNode;
  /** Custom rendering for dropdown items (replaces the default label row) */
  renderItem?: (option: Option) => ReactNode;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  variant?: SelectTriggerProps["variant"];
  size?: SelectTriggerProps["size"];
  appearance?: SelectTriggerProps["appearance"];
  /** Called on every keystroke in the search input. When provided, client-side filtering is skipped — the caller is responsible for filtering `options`. */
  onSearchChange?: (value: string) => void;
}

export function MultiSelectCombobox({
  ref,
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  selectedLabel = (count) =>
    `${count} ${count === 1 ? "item" : "items"} selected`,
  icon,
  renderItem,
  disabled = false,
  className,
  contentClassName,
  variant,
  appearance,
  size,
  onSearchChange,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // When onSearchChange is provided, the caller filters options externally
  const filteredOptions = onSearchChange
    ? options.filter((option) => !option.disabled)
    : options.filter((option) => {
        if (option.disabled) return false;
        if (search === "") return true;
        return option.label.toLowerCase().includes(search.toLowerCase());
      });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  };

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          variant={variant}
          size={size}
          appearance={appearance}
          className={cn("justify-between", className)}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            {icon}
            <span className="truncate">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedLabel(selected.length)
              )}
            </span>
          </span>
          <span className="flex items-center gap-1">
            {selected.length > 0 && !disabled && (
              <X
                className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-(--radix-popover-trigger-width) p-0",
          contentClassName,
        )}
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <div className="max-h-50 overflow-y-auto">
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      disabled={option.disabled}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="border border-border"
                        appearance="outline"
                        variant="secondary"
                      />
                      {renderItem ? (
                        renderItem(option)
                      ) : (
                        <>
                          <span className="flex-1 truncate">
                            {option.label}
                          </span>
                          {option.disabled && (
                            <span className="text-xs text-muted-foreground">
                              (disabled)
                            </span>
                          )}
                        </>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
