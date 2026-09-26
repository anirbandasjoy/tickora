"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { NumberField, type NumberFieldProps } from "../fields/number-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFNumberFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  NumberFieldProps,
  "id" | "name" | "value" | "onChange" | "onBlur" | "ref" | "error"
> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path (type-safe when `T` is provided). */
  name: FieldPath<T>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form `Controller`-based wrapper around `NumberField`.
 *
 * @example
 * ```tsx
 * <RHFNumberField
 *   control={control}
 *   name="maxWords"
 *   label="Max Words"
 *   min="1"
 *   placeholder="Enter max words..."
 * />
 * ```
 */
function RHFNumberFieldInner<T extends FieldValues = FieldValues>(
  { control, name, ...rest }: RHFNumberFieldProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    field: { ref: fieldRef, value, onChange, ...fieldProps },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <NumberField
      ref={(node) => {
        // Forward controller ref
        fieldRef(node);
        // Forward external ref if provided
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      id={name}
      value={value}
      onChange={onChange}
      error={error?.message}
      {...fieldProps}
      {...rest}
    />
  );
}

const RHFNumberField = React.forwardRef(RHFNumberFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFNumberFieldProps<T> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;

export { RHFNumberField };
