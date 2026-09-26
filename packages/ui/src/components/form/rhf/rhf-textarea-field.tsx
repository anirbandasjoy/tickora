"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  TextareaField,
  type TextareaFieldProps,
} from "../fields/textarea-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFTextareaFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  TextareaFieldProps,
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
 * React Hook Form `Controller`-based wrapper around `TextareaField`.
 *
 * @example
 * ```tsx
 * <RHFTextareaField
 *   control={control}
 *   name="description"
 *   label="Description"
 *   placeholder="Enter a description..."
 *   rows={4}
 * />
 * ```
 */
function RHFTextareaFieldInner<T extends FieldValues = FieldValues>(
  { control, name, ...rest }: RHFTextareaFieldProps<T>,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  const {
    field: { ref: fieldRef, value, ...fieldProps },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <TextareaField
      ref={(node) => {
        fieldRef(node);
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

const RHFTextareaField = React.forwardRef(RHFTextareaFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFTextareaFieldProps<T> & React.RefAttributes<HTMLTextAreaElement>,
) => React.ReactElement;

export { RHFTextareaField };
