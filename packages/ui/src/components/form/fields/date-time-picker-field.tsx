"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import { ButtonProps } from "../../core/button";
import { DateTimePicker, DateTimePicker24h } from "../../core/date-time-picker";
import { Label } from "../../core/label";
import RenderWrapper, { FieldProps } from "./shared";

const errorTextClasses =
  "text-xs text-destructive font-medium ml-1 animate-in slide-in-from-left-1";

const descriptionTextClasses = "text-[10px] text-input-foreground/60 ml-1";

export interface DateTimePickerFieldProps extends FieldProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  type?: "12h" | "24h";
  triggerProps?: Omit<ButtonProps, "children" | "className">;
  hourInterval?: number;
  minuteInterval?: number;
}

const DateTimePickerField = React.forwardRef<
  HTMLDivElement,
  DateTimePickerFieldProps
>(
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
      type = "12h",
      triggerProps,
      hourInterval,
      minuteInterval,
    },
    ref,
  ) => {
    const hasError = !!error;

    const Picker = type === "12h" ? DateTimePicker : DateTimePicker24h;

    const date = React.useMemo(() => {
      if (!value) return undefined;
      const d = new Date(value);
      return isNaN(d.getTime()) ? undefined : d;
    }, [value]);

    const handleChange = (d: Date | undefined) => {
      onChange(d ? d.toISOString() : "");
    };

    const disabledDates = React.useCallback(
      (d: Date) => {
        if (minDate && d < minDate) return true;
        if (maxDate && d > maxDate) return true;
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
            <Picker
              value={date}
              onChange={handleChange}
              placeholder={placeholder}
              className={cn(
                hasError && "[&>button]:border-destructive",
                className,
              )}
              disabled={disabled}
              disabledDates={disabledDates}
              triggerProps={triggerProps}
              hourInterval={hourInterval}
              minuteInterval={minuteInterval}
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

DateTimePickerField.displayName = "DateTimePickerField";

export { DateTimePickerField };
