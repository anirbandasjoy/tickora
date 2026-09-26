"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import { DatePicker } from "../../core/date-picker";
import { Label } from "../../core/label";
import RenderWrapper, { FieldProps } from "./shared";

const errorTextClasses =
  "text-xs text-destructive font-medium ml-1 animate-in slide-in-from-left-1";

const descriptionTextClasses = "text-[10px] text-input-foreground/60 ml-1";

export interface DatePickerFieldProps extends FieldProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const DatePickerField = React.forwardRef<HTMLDivElement, DatePickerFieldProps>(
  (
    {
      id,
      label,
      error,
      description,
      labelExtra,
      labelClassName,
      wrapperClassName,
      required,
      render,
      value,
      onChange,
      placeholder,
      className,
      disabled,
      minDate,
      maxDate,
    },
    ref,
  ) => {
    const hasError = !!error;

    const date = React.useMemo(
      () => (value ? new Date(value) : undefined),
      [value],
    );

    const handleChange = (d: Date | undefined) => {
      if (d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        onChange(`${y}-${m}-${day}`);
      } else {
        onChange("");
      }
    };

    const disabledDates = React.useCallback(
      (d: Date) => {
        if (minDate) {
          const min = new Date(minDate);
          min.setHours(0, 0, 0, 0);
          if (d < min) return true;
        }
        if (maxDate) {
          const max = new Date(maxDate);
          max.setHours(23, 59, 59, 999);
          if (d > max) return true;
        }
        return false;
      },
      [minDate, maxDate],
    );

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {(label || labelExtra) && (
          <div className="flex items-center justify-between">
            {label && (
              <Label
                htmlFor={id}
                size="md"
                variant="field"
                weight="semibold"
                required={required}
                className={labelClassName}
              >
                {label}
              </Label>
            )}
            {labelExtra}
          </div>
        )}

        <RenderWrapper render={render}>
          <div ref={ref}>
            <DatePicker
              value={date}
              onChange={handleChange}
              placeholder={placeholder}
              className={cn(
                hasError && "[&>button]:border-destructive",
                className,
              )}
              disabled={disabled}
              disabledDates={disabledDates}
            />
          </div>
        </RenderWrapper>

        {hasError ? (
          <p className={errorTextClasses}>{error}</p>
        ) : (
          description && <p className={descriptionTextClasses}>{description}</p>
        )}
      </div>
    );
  },
);

DatePickerField.displayName = "DatePickerField";

export { DatePickerField };
