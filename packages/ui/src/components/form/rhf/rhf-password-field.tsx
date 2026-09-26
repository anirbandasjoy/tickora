"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  PasswordField,
  type PasswordFieldProps,
} from "../fields/password-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFPasswordFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  PasswordFieldProps,
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
 * React Hook Form `Controller`-based password field with a built-in
 * show/hide toggle.
 *
 * @example
 * ```tsx
 * <RHFPasswordField
 *   control={control}
 *   name="password"
 *   label="Password"
 * />
 * ```
 */
function RHFPasswordFieldInner<T extends FieldValues = FieldValues>(
  { control, name, ...rest }: RHFPasswordFieldProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    field: { ref: fieldRef, value, ...fieldProps },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <PasswordField
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

const RHFPasswordField = React.forwardRef(RHFPasswordFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFPasswordFieldProps<T> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;

export { RHFPasswordField };
