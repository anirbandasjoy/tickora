"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  TagInputField,
  type TagInputFieldProps,
} from "../fields/tag-input-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFTagInputFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  TagInputFieldProps,
  "id" | "name" | "value" | "onChange" | "onBlur" | "ref" | "error"
> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path — must point to a `string[]` field. */
  name: FieldPath<T>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form `Controller`-based wrapper around `TagInputField`.
 *
 * @example
 * ```tsx
 * <RHFTagInputField
 *   control={control}
 *   name="wordBank"
 *   label="Word Bank"
 *   placeholder="Type a word and press Enter..."
 * />
 * ```
 */
function RHFTagInputFieldInner<T extends FieldValues = FieldValues>(
  { control, name, ...rest }: RHFTagInputFieldProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    field: { ref: fieldRef, value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <TagInputField
      ref={(node) => {
        fieldRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      id={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error?.message}
      {...rest}
    />
  );
}

const RHFTagInputField = React.forwardRef(RHFTagInputFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFTagInputFieldProps<T> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;

export { RHFTagInputField };
