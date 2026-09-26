"use client";

import { ChevronsUpDown, Loader2, X } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button, ButtonProps } from "../../core/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../core/command";
import { Label } from "../../core/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../core/popover";
import RenderWrapper, { type FieldProps } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AsyncSelectOption<TValue = string> {
  /** The underlying value for this option. */
  value: TValue;
  /** The text shown in the trigger when this option is selected. */
  label: string;
  /** Any extra data the caller wants to pass through to renderItem. */
  [key: string]: unknown;
}

export interface AsyncSelectFieldProps<TValue = string> extends FieldProps {
  // ── Value ─────────────────────────────────────────────────────────────────
  /** Controlled selected value. */
  value?: TValue;
  /** Fired when the user picks an option or clears the selection. */
  onChange: (value: TValue | undefined) => void;

  // ── Options ───────────────────────────────────────────────────────────────
  /** Options to render in the list. Caller is responsible for fetching/filtering. */
  options: AsyncSelectOption<TValue>[];
  /** When true, shows a spinner instead of the list. */
  isLoading?: boolean;

  // ── Search ────────────────────────────────────────────────────────────────
  /** Current search string (controlled by caller). */
  searchValue: string;
  /** Fired on every keystroke so the caller can trigger a new fetch. */
  onSearchChange: (search: string) => void;

  // ── Display ───────────────────────────────────────────────────────────────
  /** Placeholder shown in the trigger when nothing is selected. */
  placeholder?: string;
  /** Placeholder inside the search input. */
  searchPlaceholder?: string;
  /** Text shown when options is empty and not loading. */
  emptyMessage?: string;
  /** Show the × clear button when a value is selected (default: true). */
  clearable?: boolean;
  /** Disable the trigger. */
  disabled?: boolean;
  /** Width of the popover content — defaults to the trigger's width. */
  contentWidth?: string;
  /** Alignment of the popover relative to the trigger (default: "start"). */
  contentAlign?: "start" | "center" | "end";
  /** Called when the popover opens or closes. Useful for triggering initial fetches. */
  onOpenChange?: (open: boolean) => void;

  // ── Custom render ─────────────────────────────────────────────────────────
  /**
   * Override the content inside each `CommandItem`.
   * Receives the option object and whether it is currently selected.
   */
  renderItem?: (
    option: AsyncSelectOption<TValue>,
    isSelected: boolean,
  ) => React.ReactNode;
  /**
   * Override what is shown inside the trigger button when a value is selected.
   * Receives the matched option object.
   */
  renderTriggerValue?: (option: AsyncSelectOption<TValue>) => React.ReactNode;

  triggerProps?: ButtonProps;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function AsyncSelectFieldInner<TValue = string>(
  {
    id,
    label,
    error,
    description,
    labelExtra,
    labelClassName,
    wrapperClassName,
    required,
    render,
    // value / change
    value,
    onChange,
    // options
    options,
    isLoading = false,
    // search
    searchValue,
    onSearchChange,
    // display
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyMessage = "No results found.",
    clearable = true,
    disabled = false,
    contentWidth,
    contentAlign = "start",
    onOpenChange: onOpenChangeProp,
    // custom render
    renderItem,
    renderTriggerValue,
    triggerProps,
  }: AsyncSelectFieldProps<TValue>,
  _ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChangeProp?.(next);
  };

  const hasError = !!error;
  const hasLabel = label || labelExtra || required;

  const selectedOption =
    value !== undefined ? options.find((o) => o.value === value) : undefined;

  // Trigger display
  const triggerContent = selectedOption ? (
    renderTriggerValue ? (
      renderTriggerValue(selectedOption)
    ) : (
      <span>{selectedOption.label}</span>
    )
  ) : (
    <span className="text-muted-foreground">{placeholder}</span>
  );

  const handleSelect = (option: AsyncSelectOption<TValue>) => {
    onChange(option.value);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {hasLabel && (
        <div className="flex items-center justify-between">
          {label && (
            <Label
              htmlFor={id}
              variant="field"
              weight="semibold"
              required={required}
              className={labelClassName}
            >
              {label}
            </Label>
          )}
          {labelExtra}
        </div>
      )}

      <RenderWrapper render={render}>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              {...triggerProps}
              ref={_ref}
              id={id}
              type="button"
              variant={hasError ? "destructive" : "default"}
              disabled={disabled}
              className="w-full justify-between font-normal"
              aria-expanded={open}
            >
              <span className="flex min-w-0 flex-1 items-center truncate">
                {triggerContent}
              </span>
              {clearable && selectedOption ? (
                <X
                  className="ml-2 h-3.5 w-3.5 shrink-0 opacity-60"
                  onClick={handleClear}
                />
              ) : (
                <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="p-0"
            align={contentAlign}
            style={contentWidth ? { width: contentWidth } : undefined}
            // Match trigger width when no contentWidth is given
            {...(!contentWidth && {
              style: { width: "var(--radix-popover-trigger-width)" },
            })}
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onValueChange={onSearchChange}
              />
              <CommandList>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading…
                  </div>
                ) : (
                  <>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    {options.map((option) => {
                      const isSelected = option.value === value;
                      return (
                        <CommandItem
                          key={String(option.value)}
                          value={String(option.value)}
                          onSelect={() => handleSelect(option)}
                        >
                          {renderItem ? (
                            renderItem(option, isSelected)
                          ) : (
                            <span>{option.label}</span>
                          )}
                        </CommandItem>
                      );
                    })}
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </RenderWrapper>

      {hasError ? (
        <p className="ml-1 animate-in text-xs font-medium text-destructive slide-in-from-left-1">
          {error}
        </p>
      ) : (
        description && (
          <p className="text-input-foreground/60 ml-1 text-[10px]">
            {description}
          </p>
        )
      )}
    </div>
  );
}

const AsyncSelectField = React.forwardRef(AsyncSelectFieldInner) as <
  TValue = string,
>(
  props: AsyncSelectFieldProps<TValue> & React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement;

export { AsyncSelectField };
