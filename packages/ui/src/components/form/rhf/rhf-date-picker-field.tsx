"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  DatePickerField,
  type DatePickerFieldProps,
} from "../fields/date-picker-field";

export interface RHFDatePickerFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  DatePickerFieldProps,
  "id" | "value" | "onChange" | "error" | "wrapperClassName"
> {
  control: Control<T>;
  name: FieldPath<T>;
  className?: string;
}

function RHFDatePickerFieldInner<T extends FieldValues = FieldValues>(
  { control, name, className, ...rest }: RHFDatePickerFieldProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <DatePickerField
      ref={ref}
      id={name}
      value={value ?? ""}
      onChange={onChange}
      error={error?.message}
      wrapperClassName={className}
      {...rest}
    />
  );
}

const RHFDatePickerField = React.forwardRef(RHFDatePickerFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFDatePickerFieldProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;

export { RHFDatePickerField };
