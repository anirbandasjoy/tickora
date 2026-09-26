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

export type TextFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface TextFieldProps
  extends Omit<InputProps, keyof FieldProps>, FieldProps {
  /** Optional leading icon rendered inside the input. */
  icon?: LucideIcon;
  /** Additional class names merged onto the `<Input>`. */
  inputClassName?: string;
  /** Content rendered on the right side of the input (e.g. a password toggle button). */
  endAdornment?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      icon: Icon,
      error,
      description,
      inputClassName = "bg-field",
      labelClassName,
      wrapperClassName,
      endAdornment,
      labelExtra,
      size,
      variant,
      appearance,
      required,
      render,
      ...inputProps
    },
    ref,
  ) => {
    const hasIcon = !!Icon;
    const hasError = !!error;
    const hasEndAdornment = !!endAdornment;

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
              size={size}
              variant={variant}
              appearance={appearance}
              aria-invalid={hasError}
              className={cn(
                hasIcon && inputPaddingVariants({ size }),
                hasEndAdornment && inputEndPaddingVariants({ size }),
                `${inputClassName} `,
              )}
              {...inputProps}
            />

            {/* End adornment (e.g. password toggle) */}
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {" "}
              {endAdornment}
            </span>
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

TextField.displayName = "TextField";

export { TextField };
