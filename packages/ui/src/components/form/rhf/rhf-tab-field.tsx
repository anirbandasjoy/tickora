"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  TabField,
  type TabFieldOption,
  type TabFieldProps,
} from "../fields/tab-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFTabFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<
  TabFieldProps,
  "id" | "value" | "onValueChange" | "error" | "wrapperClassName"
> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path (type-safe when `T` is provided). */
  name: FieldPath<T>;
  /** Options to display as tabs. */
  options: TabFieldOption[];
  /** Additional class names merged onto the outer wrapper `<div>`. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form `Controller`-based wrapper around `TabField`.
 *
 * @example
 * ```tsx
 * <RHFTabField
 *   control={control}
 *   name="type"
 *   label="Select Type"
 *   layout="horizontal"
 *   options={[
 *     { value: "academic", label: "Academic", icon: GraduationCap },
 *     { value: "general", label: "General", icon: FileText },
 *   ]}
 * />
 * ```
 */
function RHFTabFieldInner<T extends FieldValues = FieldValues>(
  { control, name, options, className, ...rest }: RHFTabFieldProps<T>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <TabField
      id={name}
      value={value ?? ""}
      onValueChange={onChange}
      options={options}
      error={error?.message}
      wrapperClassName={className}
      {...fieldProps}
      {...rest}
    />
  );
}

const RHFTabField = React.forwardRef(RHFTabFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFTabFieldProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;

export { RHFTabField };
