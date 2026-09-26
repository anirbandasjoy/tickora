"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Label } from "../../core/label";
import { Textarea, textareaVariants } from "../../core/textarea";
import RenderWrapper, { FieldProps } from "./shared";

// ---------------------------------------------------------------------------
// Style variants with CVA
// ---------------------------------------------------------------------------

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
    defaultVariants: { size: "md" },
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
  defaultVariants: { size: "md" },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TextareaFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface TextareaFieldProps
  extends
    Omit<React.ComponentProps<"textarea">, "size" | keyof FieldProps>,
    VariantProps<typeof textareaVariants>,
    FieldProps {}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      id,
      label,
      error,
      description,
      className = "bg-field",
      wrapperClassName,
      labelExtra,
      labelClassName,
      size,
      variant,
      appearance,
      required,
      render,
      ...textareaProps
    },
    ref,
  ) => {
    const hasError = !!error;

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {label && (
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
          <Textarea
            ref={ref}
            id={id}
            size={size}
            variant={variant}
            appearance={appearance}
            aria-invalid={hasError}
            className={cn("min-w-50", className)}
            {...textareaProps}
          />
        </RenderWrapper>

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

TextareaField.displayName = "TextareaField";

export { TextareaField };
