"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { TextField, type TextFieldProps } from "../fields/text-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFTextFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  TextFieldProps,
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
 * React Hook Form `Controller`-based wrapper around `TextField`.
 *
 * @example
 * ```tsx
 * <RHFTextField
 *   control={control}
 *   name="email"
 *   label="Email"
 *   icon={Mail}
 *   placeholder="you@example.com"
 * />
 * ```
 */
function RHFTextFieldInner<T extends FieldValues = FieldValues>(
  { control, name, ...rest }: RHFTextFieldProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    field: { ref: fieldRef, value, ...fieldProps },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <TextField
      ref={(node) => {
        // Forward controller ref
        fieldRef(node);
        // Forward external ref if provided
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      id={name}
      error={error?.message}
      value={value ?? ""}
      {...fieldProps}
      {...rest}
    />
  );
}

const RHFTextField = React.forwardRef(RHFTextFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFTextFieldProps<T> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;

export { RHFTextField };
