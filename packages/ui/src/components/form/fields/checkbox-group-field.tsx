"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import { Checkbox } from "../../core/checkbox";
import { Label } from "../../core/label";
import RenderWrapper, { FieldProps } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckboxGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupFieldProps extends FieldProps {
  options: CheckboxGroupOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  className?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function CheckboxGroupFieldInner(
  {
    options,
    value = [],
    onChange,
    label,
    error,
    description,
    required,
    disabled,
    orientation = "vertical",
    wrapperClassName,
    labelClassName,
    labelExtra,
    className,
    render,
  }: CheckboxGroupFieldProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const hasError = !!error;

  const toggle = (val: string) => {
    if (disabled) return;
    const next = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange?.(next);
  };

  const allValues = options.filter((o) => !o.disabled).map((o) => o.value);
  const allSelected =
    allValues.length > 0 && allValues.every((v) => value.includes(v));

  return (
    <div ref={ref} className={cn("space-y-2", wrapperClassName, className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label
            size="md"
            variant="field"
            weight="semibold"
            required={required}
            className={labelClassName}
          >
            {label}
          </Label>
          {labelExtra}
        </div>
      )}

      <RenderWrapper render={render}>
        <div
          className={cn(
            "flex",
            orientation === "horizontal"
              ? "flex-row gap-4"
              : "flex-col gap-0.5",
          )}
        >
          <label className="flex cursor-pointer items-center gap-2.5 rounded-md bg-muted/60 px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => onChange?.(allSelected ? [] : allValues)}
              disabled={disabled}
              variant="primary"
              appearance="outline"
              size="sm"
            />
            <span className="text-foreground">Select All</span>
          </label>
          <div className="flex flex-col gap-0.5 pl-1">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <Checkbox
                  checked={value.includes(opt.value)}
                  onCheckedChange={() => toggle(opt.value)}
                  disabled={disabled || opt.disabled}
                  variant="primary"
                  appearance="outline"
                  size="sm"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </RenderWrapper>

      {hasError ? (
        <p className="ml-1 animate-in text-xs font-medium text-destructive slide-in-from-left-1">
          {error}
        </p>
      ) : (
        description && (
          <p className="ml-1 text-[10px] text-muted-foreground">
            {description}
          </p>
        )
      )}
    </div>
  );
}

CheckboxGroupFieldInner.displayName = "CheckboxGroupField";

const CheckboxGroupField = React.forwardRef(CheckboxGroupFieldInner);

export { CheckboxGroupField };
