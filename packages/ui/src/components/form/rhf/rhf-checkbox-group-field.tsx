"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  CheckboxGroupField,
  type CheckboxGroupFieldProps,
} from "../fields/checkbox-group-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFCheckboxGroupFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<CheckboxGroupFieldProps, "id" | "value" | "onChange" | "error"> {
  control: Control<T>;
  name: FieldPath<T>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function RHFCheckboxGroupFieldInner<T extends FieldValues = FieldValues>(
  { control, name, ...rest }: RHFCheckboxGroupFieldProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    field: { value, onChange, ref: _fieldRef, ...fieldProps },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <CheckboxGroupField
      ref={ref}
      id={name}
      value={value ?? []}
      onChange={onChange}
      error={error?.message}
      {...fieldProps}
      {...rest}
    />
  );
}

const RHFCheckboxGroupField = React.forwardRef(RHFCheckboxGroupFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFCheckboxGroupFieldProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;

export { RHFCheckboxGroupField };
