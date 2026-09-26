"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "../../../lib/utils";
import { Label } from "../../core/label";
import { RadioGroup, RadioGroupItem } from "../../core/radio-group";
import { RadioGroupOption } from "../fields";

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

export type RHFRadioGroupFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface RHFRadioGroupFieldProps<
  T extends FieldValues = FieldValues,
> extends VariantProps<typeof errorTextVariants> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path (type-safe when `T` is provided). */
  name: FieldPath<T>;
  /** Available options. */
  options: RadioGroupOption[];
  /** Label text displayed above the radio group. */
  label?: React.ReactNode;
  /** Helper / description text. */
  description?: React.ReactNode;
  /** Layout direction. */
  orientation?: "horizontal" | "vertical";
  /** Whether the field is required. */
  required?: boolean;
  /** Additional class names for the wrapper. */
  className?: string;
  /** Additional class names merged onto the `<Label>`. */
  labelClassName?: string;
  /** Extra content rendered alongside label. */
  labelExtra?: React.ReactNode;
  /** Whether the entire group is disabled. */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form wrapper around the Radix `RadioGroup`.
 *
 * @example
 * ```tsx
 * <RHFRadioGroupField
 *   control={control}
 *   name="answer"
 *   label="Select answer"
 *   options={[
 *     { label: "True", value: "TRUE" },
 *     { label: "False", value: "FALSE" },
 *     { label: "Not Given", value: "NOT_GIVEN" },
 *   ]}
 * />
 * ```
 */
export function RHFRadioGroupField<T extends FieldValues = FieldValues>({
  control,
  name,
  options,
  label,
  description,
  orientation = "vertical",
  required,
  className,
  labelClassName,
  labelExtra,
  disabled,
  size,
}: RHFRadioGroupFieldProps<T>) {
  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <div className={cn("space-y-2", className)}>
      {(label || labelExtra) && (
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

      <RadioGroup
        value={value ?? ""}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(orientation === "horizontal" && "flex flex-row gap-4")}
        {...fieldProps}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              disabled={option.disabled}
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="cursor-pointer font-normal"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error?.message ? (
        <p className={errorTextVariants({ size })}>{error.message}</p>
      ) : (
        description && (
          <p className={descriptionTextVariants({ size })}>{description}</p>
        )
      )}
    </div>
  );
}
