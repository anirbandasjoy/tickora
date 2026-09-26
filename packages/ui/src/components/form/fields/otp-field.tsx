"use client";

import { cn } from "../../../lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../core/input-otp";
import { Label } from "../../core/label";
import RenderWrapper, { FieldProps } from "./shared";

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const labelClasses = "text-muted-foreground ";

const errorTextClasses =
  "text-xs text-destructive font-medium ml-1 animate-in slide-in-from-left-1";

const descriptionTextClasses = "text-[10px] text-muted-foreground ml-1";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OTPFieldProps extends FieldProps {
  /** Number of OTP digits. @default 6 */
  length?: number;
  /** Current OTP value as a string. */
  value?: string;
  /** Called with the full OTP string whenever any digit changes. */
  onChange?: (value: string) => void;
  /** Called when the user finishes entering all digits. */
  onComplete?: (value: string) => void;
  /** Additional class names on the outer wrapper. */
  className?: string;
  /** Additional class names passed to `InputOTP` container. */
  containerClassName?: string;
  /** Additional class names on the `InputOTPGroup` container. */
  groupClassName?: string;
  /** Additional class names on each individual slot. */
  slotClassName?: string;
  /** Auto-focus on mount. @default false */
  autoFocus?: boolean;
  /** Regex pattern for allowed input. @default "^\\d+$" (digits only) */
  pattern?: string;
  /** Whether the field is disabled. */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * OTP input field built on top of the shadcn `InputOTP` primitive (`input-otp` library).
 *
 * @example
 * ```tsx
 * <OTPField
 *   label="Verification Code"
 *   value={otp}
 *   onChange={setOtp}
 *   onComplete={(code) => verify(code)}
 *   length={6}
 * />
 * ```
 */
function OTPField({
  label,
  length = 6,
  value = "",
  onChange,
  onComplete,
  error,
  description,
  disabled = false,
  className,
  containerClassName,
  groupClassName,
  slotClassName,
  autoFocus = false,
  pattern = "^\\d+$",
  render,
}: OTPFieldProps) {
  const hasError = !!error;

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className={labelClasses}>{label}</Label>}

      <RenderWrapper render={render}>
        <InputOTP
          maxLength={length}
          value={value}
          onChange={(val: string) => onChange?.(val)}
          onComplete={onComplete}
          disabled={disabled}
          autoFocus={autoFocus}
          pattern={pattern}
          containerClassName={containerClassName}
          {...(hasError ? { "aria-invalid": true } : {})}
        >
          <InputOTPGroup spacing="spaced" className={groupClassName}>
            {Array.from({ length }, (_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                variant="field"
                size="lg"
                aria-invalid={hasError || undefined}
                className={slotClassName}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </RenderWrapper>

      {/* Error / description */}
      {hasError ? (
        <p className={errorTextClasses}>{error}</p>
      ) : (
        description && <p className={descriptionTextClasses}>{description}</p>
      )}
    </div>
  );
}

OTPField.displayName = "OTPField";

export { OTPField };
