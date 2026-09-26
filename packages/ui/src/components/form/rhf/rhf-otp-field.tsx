"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { OTPField, type OTPFieldProps } from "../fields/otp-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFOTPFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<OTPFieldProps, "value" | "onChange" | "error" | "id"> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path (type-safe when `T` is provided). */
  name: FieldPath<T>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form `Controller`-based wrapper around `OTPField`.
 *
 * @example
 * ```tsx
 * <RHFOTPField
 *   control={control}
 *   name="verificationCode"
 *   label="Verification Code"
 *   length={6}
 *   onComplete={(code) => handleVerify(code)}
 * />
 * ```
 */
function RHFOTPFieldInner<T extends FieldValues = FieldValues>(
  { control, name, ...rest }: RHFOTPFieldProps<T>,
  _ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <OTPField
      id={name}
      value={value ?? ""}
      onChange={onChange}
      error={error?.message}
      {...rest}
    />
  );
}

const RHFOTPField = React.forwardRef(RHFOTPFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFOTPFieldProps<T> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;

export { RHFOTPField };
