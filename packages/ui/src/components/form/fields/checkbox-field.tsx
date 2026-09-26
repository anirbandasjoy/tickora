"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import { Checkbox } from "../../core/checkbox";
import RenderWrapper from "./shared";

// ---------------------------------------------------------------------------
// Style constants - FIXED FOR LIGHT/DARK MODE
// ---------------------------------------------------------------------------

const checkboxBaseClasses =
  "mt-0.5 border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary rounded-[4px] h-4 w-4";

const labelClasses =
  "text-sm font-medium leading-relaxed text-foreground/80 dark:text-muted-foreground cursor-pointer select-none";

const errorTextClasses =
  "text-xs text-destructive font-medium ml-1 animate-in slide-in-from-left-1";

const descriptionTextClasses = "text-[10px] text-muted-foreground ml-1";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckboxFieldProps extends Omit<
  React.ComponentProps<typeof Checkbox>,
  "id"
> {
  id: string;
  label: React.ReactNode;
  error?: string;
  description?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  wrapperClassName?: string;
  direction?: "row" | "column";
  render?: (children: React.ReactNode) => React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CheckboxField = React.forwardRef<
  React.ComponentRef<typeof Checkbox>,
  CheckboxFieldProps
>(
  (
    {
      id,
      label,
      error,
      description,
      className,
      labelClassName,
      checkboxClassName,
      wrapperClassName,
      direction = "row",
      render,
      ...checkboxProps
    },
    ref,
  ) => {
    const hasError = !!error;

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        <RenderWrapper render={render}>
          <div
            className={cn(
              "flex",
              direction === "column"
                ? "flex-col-reverse items-start space-y-1"
                : "flex-row items-start space-x-3",
            )}
          >
            <Checkbox
              ref={ref}
              id={id}
              className={cn(
                checkboxBaseClasses,
                hasError && "border-destructive",
                checkboxClassName,
              )}
              {...checkboxProps}
            />
            <label
              htmlFor={id}
              className={cn(labelClasses, labelClassName, className)}
            >
              {label}
            </label>
          </div>
        </RenderWrapper>

        {/* Feedback text */}
        {hasError ? (
          <p className={errorTextClasses}>{error}</p>
        ) : (
          description && <p className={descriptionTextClasses}>{description}</p>
        )}
      </div>
    );
  },
);

CheckboxField.displayName = "CheckboxField";

export { CheckboxField };
