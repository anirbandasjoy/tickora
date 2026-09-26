"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Checkbox } from "../../core/checkbox";
import {
  CheckboxField,
  type CheckboxFieldProps,
} from "../fields/checkbox-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFCheckboxFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  CheckboxFieldProps,
  "id" | "checked" | "onCheckedChange" | "ref" | "error"
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
 * React Hook Form `Controller`-based wrapper around `CheckboxField`.
 *
 * @example
 * ```tsx
 * <RHFCheckboxField
 *   control={control}
 *   name="agreeToTerms"
 *   label={<>I agree to the <Link href="/terms">Terms</Link></>}
 * />
 * ```
 */
function RHFCheckboxFieldInner<T extends FieldValues = FieldValues>(
  { control, name, ...rest }: RHFCheckboxFieldProps<T>,
  ref: React.ForwardedRef<React.ComponentRef<typeof Checkbox>>,
) {
  const {
    field: { ref: fieldRef, value, onChange, ...fieldProps },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <CheckboxField
      ref={(node) => {
        // Forward controller ref
        fieldRef(node);
        // Forward external ref if provided
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      id={name}
      checked={!!value}
      onCheckedChange={onChange}
      error={error?.message}
      {...fieldProps}
      {...rest}
    />
  );
}

const RHFCheckboxField = React.forwardRef(
  RHFCheckboxFieldInner as unknown as React.ForwardRefRenderFunction<
    React.ComponentRef<typeof Checkbox>,
    Omit<RHFCheckboxFieldProps, "ref">
  >,
) as unknown as <T extends FieldValues = FieldValues>(
  props: RHFCheckboxFieldProps<T> &
    React.RefAttributes<React.ComponentRef<typeof Checkbox>>,
) => React.ReactElement;

export { RHFCheckboxField };
