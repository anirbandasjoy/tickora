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
const DEFAULT_OPTION_KEY = "__SELECT_FIELD_DEFAULT__";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectOption<TValue = string> {
  /** The value used when the option is selected. */
  value: TValue;
  /** The display label for the option. */
  label: string;
  /** Whether the option is disabled. */
  disabled?: boolean;
}

export interface DefaultOption<TValue = string> {
  /** The value to set when this option is selected (can be null, undefined, or any value). */
  value: TValue | null | undefined;
  /** The display label for the default option. */
  label: string;
}

export type SelectFieldSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "icon"
  | "icon-sm";

export type SelectFieldProps<TValue = string> = FieldProps & {
  /** Array of options to display in the dropdown. */
  options: SelectOption<TValue>[];
  /** Default/reset option shown first. When selected, sets value to defaultOption.value. */
  defaultOption?: DefaultOption<TValue>;
  /** Placeholder text displayed when no value is selected (only shown if no defaultOption). */
  placeholder?: string;
  /** The controlled value of the select. */
  value?: TValue;
  /** Callback fired when the value changes. */
  onValueChange?: (value: TValue) => void;
  /** Default value for uncontrolled usage. */
  defaultValue?: TValue;
  /** Optional leading icon rendered inside the trigger. */
  icon?: LucideIcon;
  /** Additional class names merged onto the `<SelectTrigger>`. */
  triggerClassName?: string;
  /** Whether the select is disabled. */
  disabled?: boolean;
  /** Name attribute for form submission. */
  name?: string;
} & Omit<SelectTriggerProps, "id" | "disabled" | "className" | "placeholder">;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      id,
      label,
      options,
      defaultOption,
      placeholder = "Select an option",
      value,
      onValueChange,
      defaultValue,
      size = "md",
      variant = "default",
      appearance = "outline",
      icon: Icon,
      error,
      description,
      labelExtra,
      labelClassName,
      triggerClassName = "bg-field",
      wrapperClassName,
      disabled,
      required,
      name,
      render,
    },
    ref,
  ) => {
    const hasIcon = !!Icon;
    const hasError = !!error;
    const hasLabel = label || labelExtra || required;

    // Map icon/icon-sm sizes to valid variant sizes
    const iconSize = size === "icon" || size === "icon-sm" ? "md" : size;

    // Check if current value matches the default option value
    const isDefaultOptionSelected =
      defaultOption &&
      (value === defaultOption.value ||
        (value === undefined && defaultOption.value === undefined) ||
        (value === null && defaultOption.value === null));

    // Convert value to string for Radix Select
    // Use special key for default option's null/undefined values
    const getStringValue = (): string | undefined => {
      if (isDefaultOptionSelected) {
        return DEFAULT_OPTION_KEY;
      }
      if (value !== undefined && value !== null) {
        const str = String(value);
        return str === "" ? undefined : str;
      }
      return undefined;
    };

    const stringValue = getStringValue();
    const stringDefaultValue =
      defaultValue !== undefined ? String(defaultValue) : undefined;

    // Handle value change and convert back to original type
    const handleValueChange = (newStringValue: string) => {
      if (!onValueChange) return;

      // Handle default option selection
      if (newStringValue === DEFAULT_OPTION_KEY && defaultOption) {
        onValueChange(defaultOption.value as string);
        return;
      }

      // Find the original option value
      const selectedOption = options.find(
        (opt) => String(opt.value) === newStringValue,
      );
      if (selectedOption) {
        onValueChange(selectedOption.value);
      }
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
              <div className={iconWrapperVariants({ size: iconSize })}>
                <Icon className={iconVariants({ size: iconSize })} />
              </div>
            )}

            <Select
              value={stringValue}
              onValueChange={handleValueChange}
              defaultValue={stringDefaultValue}
              disabled={disabled}
              name={name}
            >
              <SelectTrigger
                ref={ref}
                id={id}
                size={size}
                variant={variant}
                appearance={appearance}
                aria-invalid={hasError}
                className={cn(
                  hasIcon && iconPaddingVariants({ size: iconSize }),
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
                {options
                  .filter((option) => !!option.value)
                  .map((option) => (
                    <SelectItem
                      key={String(option.value)}
                      value={String(option.value)}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
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

SelectField.displayName = "SelectField";

export { SelectField };
