"use client";

import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Input, InputProps } from "../../core/input";
import { Label } from "../../core/label";
import RenderWrapper, { FieldProps } from "./shared";

// ---------------------------------------------------------------------------
// Style variants with CVA
// ---------------------------------------------------------------------------

const inputPaddingVariants = cva("", {
  variants: {
    size: {
      xs: "pl-9",
      sm: "pl-10",
      md: "pl-10",
      lg: "pl-11",
      xl: "pl-14",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const inputEndPaddingVariants = cva("", {
  variants: {
    size: {
      xs: "pr-9",
      sm: "pr-10",
      md: "pr-10",
      lg: "pr-11",
      xl: "pr-14",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const iconWrapperVariants = cva(
  "text-input-foreground/60 group-focus-within:text-input-foreground absolute top-1/2 -translate-y-1/2 transition-colors duration-200",
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

const iconSizeVariants = cva("", {
  variants: {
    size: {
      xs: "size-4",
      sm: "size-4",
      md: "size-4",
      lg: "size-5",
      xl: "size-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const errorTextVariants = cva(
  "ml-1 animate-in font-medium text-destructive slide-in-from-left-1",
  {
    variants: {
      size: {
        xs: "text-[10px]",
        sm: "text-[10px]",
        md: "text-xs",
        lg: "text-xs",
        xl: "text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const descriptionTextVariants = cva("text-input-foreground/60 ml-1", {
  variants: {
    size: {
      xs: "text-[9px]",
      sm: "text-[9px]",
      md: "text-[10px]",
      lg: "text-[10px]",
      xl: "text-xs",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NumberFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface NumberFieldProps
  extends
    Omit<InputProps, "value" | "onChange" | keyof FieldProps>,
    FieldProps {
  /** Optional leading icon rendered inside the input. */
  icon?: LucideIcon;
  /** Additional class names merged onto the `<Input>`. */
  inputClassName?: string;
  /** Content rendered on the right side of the input (e.g. a unit label). */
  endAdornment?: React.ReactNode;
  /** The current numeric value. */
  value?: number | null | undefined;
  /** Callback fired when value changes. Receives a number or null/undefined. */
  onChange?: (value: number | null | undefined) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      id,
      label,
      icon: Icon,
      error,
      description,
      className = "bg-field",
      inputClassName,
      labelClassName,
      wrapperClassName,
      endAdornment,
      labelExtra,
      size,
      variant,
      appearance,
      required,
      value,
      onChange,
      render,
      ...inputProps
    },
    ref,
  ) => {
    const hasIcon = !!Icon;
    const hasError = !!error;
    const hasEndAdornment = !!endAdornment;

    // Convert number value to string for input display
    const stringValue =
      value === null || value === undefined ? "" : String(value);

    // Handle change and convert to number
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (inputValue === "") {
        onChange?.(null);
      } else {
        const numValue = parseFloat(inputValue);
        onChange?.(isNaN(numValue) ? null : numValue);
      }
    };

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {(label || labelExtra) && (
          <div className="flex items-center justify-between">
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
            {labelExtra}
          </div>
        )}

        <RenderWrapper render={render}>
          <div className="group relative">
            {/* Leading icon */}
            {Icon && (
              <div className={iconWrapperVariants({ size })}>
                <Icon className={iconSizeVariants({ size })} />
              </div>
            )}

            <Input
              ref={ref}
              id={id}
              type="number"
              size={size}
              variant={variant}
              appearance={appearance}
              value={stringValue}
              onChange={onChange ? handleChange : undefined}
              aria-invalid={hasError}
              className={cn(
                hasIcon && inputPaddingVariants({ size }),
                hasEndAdornment && inputEndPaddingVariants({ size }),
                className,
                inputClassName,
              )}
              {...inputProps}
            />

            {/* End adornment (e.g. unit label) */}
            {endAdornment}
          </div>
        </RenderWrapper>

        {/* Error message */}
        {hasError ? (
          <p className={errorTextVariants({ size })}>{error}</p>
        ) : (
          description && (
            <p className={descriptionTextVariants({ size })}>{description}</p>
          )
        )}
      </div>
    );
  },
);

NumberField.displayName = "NumberField";

export { NumberField };
