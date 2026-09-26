"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  DateTimePickerField,
  type DateTimePickerFieldProps,
} from "../fields/date-time-picker-field";

export interface RHFDateTimePickerFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  DateTimePickerFieldProps,
  "id" | "value" | "onChange" | "error" | "wrapperClassName"
> {
  control: Control<T>;
  name: FieldPath<T>;
  className?: string;
}

function RHFDateTimePickerFieldInner<T extends FieldValues = FieldValues>(
  { control, name, className, ...rest }: RHFDateTimePickerFieldProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <DateTimePickerField
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

const RHFDateTimePickerField = React.forwardRef(
  RHFDateTimePickerFieldInner,
) as <T extends FieldValues = FieldValues>(
  props: RHFDateTimePickerFieldProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;

export { RHFDateTimePickerField };
