"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  CurrencyField,
  type CurrencyFieldProps,
} from "../fields/currency-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFCurrencyFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  CurrencyFieldProps,
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
 * React Hook Form `Controller`-based wrapper around `CurrencyField`.
 *
 * @example
 * ```tsx
 * <RHFCurrencyField
 *   control={control}
 *   name="amount"
 *   label="Amount"
 *   currency="USD"
 *   placeholder="0.00"
 * />
 * ```
 */
function RHFCurrencyFieldInner<T extends FieldValues = FieldValues>(
  { control, name, ...rest }: RHFCurrencyFieldProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    field: {
      ref: fieldRef,
      value,
      onChange: fieldOnChange,
      onBlur,
      ...fieldProps
    },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <CurrencyField
      ref={(node) => {
        fieldRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      id={name}
      error={error?.message}
      value={value ?? undefined}
      onChange={(subunit) => fieldOnChange(subunit)}
      onBlur={onBlur}
      {...fieldProps}
      {...rest}
    />
  );
}

const RHFCurrencyField = React.forwardRef(RHFCurrencyFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFCurrencyFieldProps<T> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;

export { RHFCurrencyField };
