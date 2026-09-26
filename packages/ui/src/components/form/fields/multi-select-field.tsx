"use client";

import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Label } from "../../core/label";
import { MultiSelect, MultiSelectProps } from "../../core/multi-select";
import RenderWrapper, { FieldProps } from "./shared";

// ---------------------------------------------------------------------------
// Style variants
// ---------------------------------------------------------------------------

const iconWrapperVariants = cva(
  "text-input-foreground/60 group-focus-within:text-input-foreground pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 transition-colors duration-200",
  {
    variants: {
      size: {
        xs: "left-2.5",
        sm: "left-3",
        md: "left-3",
        lg: "left-3.5",
        xl: "left-4",
        icon: "left-2.5",
        "icon-sm": "left-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const iconVariants = cva("", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-3.5",
      md: "size-3.5",
      lg: "size-4",
      xl: "size-5",
      icon: "size-3",
      "icon-sm": "size-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const iconPaddingVariants = cva("", {
  variants: {
    size: {
      xs: "pl-9",
      sm: "pl-10",
      md: "pl-10",
      lg: "pl-12",
      xl: "pl-14",
      icon: "pl-9",
      "icon-sm": "pl-9",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const wrapperPaddingVariants = cva("", {
  variants: {
    size: {
      xs: "px-2.5 py-1.5",
      sm: "px-3 py-1.5",
      md: "px-3 py-2",
      lg: "px-3.5 py-2.5",
      xl: "px-4 py-3",
      icon: "px-2.5 py-1.5",
      "icon-sm": "px-2.5 py-1.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const errorTextClasses =
  "text-xs text-destructive font-medium ml-1 animate-in slide-in-from-left-1";

const descriptionTextClasses = "text-[10px] text-input-foreground/60 ml-1";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MultiSelectFieldProps
  extends Omit<MultiSelectProps, "selected">, FieldProps {
  /** The controlled array of selected values. */
  value?: string[];
  /** Callback fired when selected values change. */
  onChange: (values: string[]) => void;
  /** Default values for uncontrolled usage. */
  defaultValue?: string[];
  /** Optional leading icon rendered inside trigger. */
  icon?: LucideIcon;
  /** Additional class names merged onto `<MultiSelect>`. */
  className?: string;
  /** Whether multi-select is disabled. */
  disabled?: boolean;
  /** Placeholder text displayed when no values are selected. */
  placeholder?: string;
  /** Search placeholder text. */
  searchPlaceholder?: string;
  /** Message shown when no options match search. */
  emptyMessage?: string;
  /** Maximum number of selected items to display as badges. */
  maxDisplay?: number;
  /** Called on every keystroke in the search input. When provided, client-side filtering is skipped. */
  onSearchChange?: (value: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MultiSelectField = React.forwardRef<
  HTMLButtonElement,
  MultiSelectFieldProps
>(
  (
    {
      id,
      label,
      options,
      value,
      onChange,
      defaultValue,
      size,
      variant,
      icon: Icon,
      error,
      description,
      labelExtra,
      labelClassName,
      className,
      wrapperClassName,
      disabled,
      required,
      placeholder,
      searchPlaceholder,
      emptyMessage,
      maxDisplay = 3,
      appearance,
      render,
      onSearchChange,
    },
    ref,
  ) => {
    const hasIcon = !!Icon;
    const hasError = !!error;
    const hasLabel = label || labelExtra || required;

    // Determine variant based on error state
    const multiSelectVariant = error ? "destructive" : variant;

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {hasLabel && (
          <div className="flex items-center justify-between">
            {label && (
              <Label
                htmlFor={id}
                size={size}
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
          <div className="group relative">
            {/* Leading icon */}
            {Icon && (
              <div className={iconWrapperVariants({ size })}>
                <Icon className={iconVariants({ size })} />
              </div>
            )}

            <MultiSelect
              ref={ref}
              options={options}
              selected={value || defaultValue || []}
              onChange={onChange}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              emptyMessage={emptyMessage}
              disabled={disabled}
              variant={multiSelectVariant}
              appearance={appearance}
              maxDisplay={maxDisplay}
              onSearchChange={onSearchChange}
              className={cn(
                hasIcon && iconPaddingVariants({ size }),
                wrapperPaddingVariants({ size }),
                className,
              )}
              size={size}
            />
          </div>
        </RenderWrapper>

        {/* Error message */}
        {hasError ? (
          <p className={errorTextClasses}>{error}</p>
        ) : (
          description && <p className={descriptionTextClasses}>{description}</p>
        )}
      </div>
    );
  },
);

MultiSelectField.displayName = "MultiSelectField";

export { MultiSelectField };
