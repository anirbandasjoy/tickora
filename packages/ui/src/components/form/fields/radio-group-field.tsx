"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { Label } from "../../core/label";
import { RadioGroup, RadioGroupItem } from "../../core/radio-group";
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

export type RadioGroupFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface RadioGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupFieldProps
  extends VariantProps<typeof errorTextVariants>, FieldProps {
  /** Available options. */
  options: RadioGroupOption[];
  /** Current value. */
  value?: string;
  /** Callback fired when the value changes. */
  onValueChange?: (value: string) => void;
  /** Layout direction. */
  orientation?: "horizontal" | "vertical";
  /** Additional class names for the RadioGroup. */
  className?: string;
  /** Whether the entire group is disabled. */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function RadioGroupField({
  options,
  value,
  onValueChange,
  label,
  error,
  description,
  orientation = "vertical",
  required,
  wrapperClassName,
  labelClassName,
  labelExtra,
  className,
  disabled,
  size,
  render,
  id,
}: RadioGroupFieldProps) {
  const hasError = !!error;

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label
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
        <RadioGroup
          value={value ?? ""}
          onValueChange={onValueChange}
          disabled={disabled}
          className={cn(
            orientation === "horizontal" && "flex flex-row gap-4",
            className,
          )}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem
                value={option.value}
                id={id ? `${id}-${option.value}` : option.value}
                disabled={option.disabled}
              />
              <Label
                htmlFor={id ? `${id}-${option.value}` : option.value}
                className="cursor-pointer font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
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
}

RadioGroupField.displayName = "RadioGroupField";

export { RadioGroupField };
