"use client";

import * as React from "react";

import { TextField, type TextFieldProps } from "./text-field";
import { fromSubunit, toSubunit } from "@/lib/currency";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCurrencySymbol(currency: string, locale = "en"): string {
  try {
    return (
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .formatToParts(0)
        .find((p) => p.type === "currency")?.value ?? currency
    );
  } catch {
    return currency;
  }
}

/** Format a whole-unit integer with thousand separators: 1000 → "1,000" */
function formatWhole(n: number): string {
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/** Strip non-digits and parse as a whole-unit integer */
function parseWhole(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, "");
  return digits === "" ? 0 : parseInt(digits, 10);
}

/**
 * Convert an incoming subunit prop value to the formatted display string.
 * Returns "" for 0 / empty so the field starts blank rather than showing "0".
 */
function subunitToDisplay(v: number | string | undefined): string {
  if (v === undefined || v === null || v === "" || v === 0) return "";
  const n = typeof v === "string" ? Number(v) : v;
  if (isNaN(n) || n === 0) return "";
  return formatWhole(fromSubunit(n));
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CurrencyFieldProps extends Omit<
  TextFieldProps,
  "type" | "endAdornment" | "inputMode" | "value" | "onChange" | "onBlur"
> {
  /**
   * ISO 4217 currency code (e.g. "USD", "EUR", "BDT").
   * Shown as a trailing adornment.
   */
  currency: string;
  /**
   * Value in the SMALLEST currency subunit (paisa / cents).
   * e.g. value=10000 → displays "100" for BDT.
   */
  value?: number | string;
  /**
   * Called with the new subunit integer on every change.
   * e.g. user types "1,000" → onChange(100000)
   */
  onChange?: (subunitValue: number) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CurrencyField = React.forwardRef<HTMLInputElement, CurrencyFieldProps>(
  ({ currency, value, onChange, onBlur, ...rest }, ref) => {
    const symbol = getCurrencySymbol(currency);
    const isSameAsCode = symbol === currency;

    // Internal display state: formatted whole-unit string shown in the input
    const [displayValue, setDisplayValue] = React.useState(() =>
      subunitToDisplay(value),
    );

    // Distinguish user-triggered changes from external/programmatic ones
    const isUserChange = React.useRef(false);

    // Sync when the prop changes externally (form reset, programmatic update)
    React.useEffect(() => {
      if (isUserChange.current) {
        isUserChange.current = false;
        return;
      }
      setDisplayValue(subunitToDisplay(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const raw = input.value;
      const cursorPos = input.selectionStart ?? raw.length;

      // Digit-relative cursor position (so we can restore it after inserting commas)
      const nonDigitsBefore = (raw.slice(0, cursorPos).match(/[^0-9]/g) ?? [])
        .length;
      const digitCursor = cursorPos - nonDigitsBefore;

      const whole = parseWhole(raw);
      const hasDigits = raw.replace(/[^0-9]/g, "") !== "";
      const formatted = hasDigits ? formatWhole(whole) : "";

      isUserChange.current = true;
      setDisplayValue(formatted);
      onChange?.(toSubunit(whole));

      // Restore cursor to the same digit offset inside the newly formatted string
      if (formatted) {
        requestAnimationFrame(() => {
          let seen = 0;
          let newPos = formatted.length;
          for (let i = 0; i < formatted.length; i++) {
            if (/[0-9]/.test(formatted[i]!)) seen++;
            if (seen === digitCursor) {
              newPos = i + 1;
              break;
            }
          }
          input.setSelectionRange(newPos, newPos);
        });
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Clean up any edge-case display value on blur
      const whole = parseWhole(displayValue);
      setDisplayValue(whole === 0 ? "" : formatWhole(whole));
      onBlur?.(e);
    };

    const adornment = (
      <div className="text-input-foreground/60 group-focus-within:text-input-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center gap-1 transition-colors duration-200">
        {!isSameAsCode && <span className="font-medium">{symbol}</span>}
        <span className="font-mono text-xs uppercase">{currency}</span>
      </div>
    );

    return (
      <TextField
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        endAdornment={adornment}
        {...rest}
      />
    );
  },
);

CurrencyField.displayName = "CurrencyField";

export { CurrencyField };
