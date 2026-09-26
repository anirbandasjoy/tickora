"use client";

import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Label } from "../../core/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectTriggerProps,
  SelectValue,
} from "../../core/select";
import RenderWrapper, { FieldProps } from "./shared";

// ---------------------------------------------------------------------------
// Style variants
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const errorTextClasses =
  "text-xs text-destructive font-medium ml-1 animate-in slide-in-from-left-1";

const descriptionTextClasses = "text-[10px] text-input-foreground/60 ml-1";

// Internal marker for the default option (since Radix requires non-empty strings)
const DEFAULT_OPTION_KEY = "__SORT_FIELD_DEFAULT__";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SortOrder = "asc" | "desc";

export interface SortOption {
  /** The field to sort by. */
  sortBy: string;
  /** The sort direction. */
  sortOrder: SortOrder;
  /** The display label for the option. */
  label: string;
}

export interface DefaultSortOption {
  /** The sortBy value to set when this option is selected (can be null, undefined, or any value). */
  sortBy: string | null | undefined;
  /** The sortOrder value to set when this option is selected (can be null, undefined, or any value). */
  sortOrder: SortOrder | null | undefined;
  /** The display label for the default option. */
  label: string;
}

export type SortFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SortFieldProps extends FieldProps {
  /** Array of sort options to display in the dropdown. */
  options: SortOption[];
  /** Default/reset option shown first. When selected, sets values to defaultOption.sortBy and defaultOption.sortOrder. */
  defaultOption?: DefaultSortOption;
  /** Placeholder text displayed when no value is selected. */
  placeholder?: string;
  /** Current sortBy value (controlled). */
  sortBy?: string;
  /** Current sortOrder value (controlled). */
  sortOrder?: SortOrder;
  /** Callback fired when sort changes. */
  onSortChange?: (sortBy: string, sortOrder: SortOrder) => void;
  /** Default sortBy for uncontrolled usage. */
  defaultSortBy?: string;
  /** Default sortOrder for uncontrolled usage. */
  defaultSortOrder?: SortOrder;
  /** Optional leading icon rendered inside the trigger. */
  icon?: LucideIcon;
  /** Additional class names merged onto the `<SelectTrigger>`. */
  triggerClassName?: string;
  /** Whether the select is disabled. */
  disabled?: boolean;
  /** Size of the sort field. */
  size?: SelectTriggerProps["size"];
  /** The variant style of the select trigger. */
  variant?: SelectTriggerProps["variant"];
  /** The appearance style of the select trigger. */
  appearance?: SelectTriggerProps["appearance"];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Sort field that combines sortBy and sortOrder into a single select.
 * Useful for table/list sorting controls.
 *
 * @example
 * ```tsx
 * <SortField
 *   id="sort"
 *   label="Sort By"
 *   options={[
 *     { sortBy: "createdAt", sortOrder: "desc", label: "Created (Newest First)" },
 *     { sortBy: "createdAt", sortOrder: "asc", label: "Created (Oldest First)" },
 *     { sortBy: "name", sortOrder: "asc", label: "Name (A to Z)" },
 *     { sortBy: "name", sortOrder: "desc", label: "Name (Z to A)" },
 *   ]}
 *   sortBy={sortBy}
 *   sortOrder={sortOrder}
 *   onSortChange={(by, order) => {
 *     setSortBy(by);
 *     setSortOrder(order);
 *   }}
 * />
 * ```
 */
const SortField = React.forwardRef<HTMLButtonElement, SortFieldProps>(
  (
    {
      id,
      label,
      options,
      defaultOption,
      placeholder = "Sort by...",
      sortBy,
      sortOrder,
      onSortChange,
      defaultSortBy,
      defaultSortOrder,
      size,
      variant,
      appearance,
      icon: Icon,
      error,
      description,
      labelExtra,
      labelClassName,
      triggerClassName,
      wrapperClassName,
      disabled,
      required,
      render,
    },
    ref,
  ) => {
    const hasIcon = !!Icon;
    const hasError = !!error;
    const hasLabel = label || labelExtra || required;

    // Check if current value matches the default option value
    const isDefaultOptionSelected =
      defaultOption &&
      ((sortBy === defaultOption.sortBy &&
        sortOrder === defaultOption.sortOrder) ||
        (sortBy === undefined &&
          sortOrder === undefined &&
          defaultOption.sortBy === undefined &&
          defaultOption.sortOrder === undefined) ||
        (sortBy === null &&
          sortOrder === null &&
          defaultOption.sortBy === null &&
          defaultOption.sortOrder === null));

    // Combine sortBy and sortOrder into a single string value
    const combineValue = (
      by?: string,
      order?: SortOrder,
    ): string | undefined => {
      if (by && order) {
        return `${by}-${order}`;
      }
      return undefined;
    };

    // Parse combined value back to sortBy and sortOrder
    const parseValue = (
      value: string,
    ): { sortBy: string; sortOrder: SortOrder } => {
      const lastDashIndex = value.lastIndexOf("-");
      const by = value.substring(0, lastDashIndex);
      const order = value.substring(lastDashIndex + 1) as SortOrder;
      return { sortBy: by, sortOrder: order };
    };

    // Get string value for Radix Select
    const getStringValue = (): string | undefined => {
      if (isDefaultOptionSelected) {
        return DEFAULT_OPTION_KEY;
      }
      return combineValue(sortBy, sortOrder);
    };

    const currentValue = getStringValue();
    const defaultValue = combineValue(defaultSortBy, defaultSortOrder);

    const handleValueChange = (value: string) => {
      if (!onSortChange) return;

      // Handle default option selection
      if (value === DEFAULT_OPTION_KEY && defaultOption) {
        onSortChange(
          defaultOption.sortBy as string,
          defaultOption.sortOrder as SortOrder,
        );
        return;
      }

      const { sortBy, sortOrder } = parseValue(value);
      onSortChange(sortBy, sortOrder);
    };

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

            <Select
              value={currentValue}
              onValueChange={handleValueChange}
              defaultValue={defaultValue}
              disabled={disabled}
            >
              <SelectTrigger
                ref={ref}
                id={id}
                size={size}
                variant={variant}
                appearance={appearance}
                aria-invalid={hasError}
                className={cn(
                  hasIcon && iconPaddingVariants({ size }),
                  triggerClassName,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {defaultOption && (
                  <SelectItem value={DEFAULT_OPTION_KEY}>
                    {defaultOption.label}
                  </SelectItem>
                )}
                {options.map((option) => {
                  const optionValue = `${option.sortBy}-${option.sortOrder}`;
                  return (
                    <SelectItem key={optionValue} value={optionValue}>
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
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

SortField.displayName = "SortField";

export { SortField };
