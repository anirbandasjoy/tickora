"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Label } from "../../core/label";
import RenderWrapper, { FieldProps } from "./shared";

// ---------------------------------------------------------------------------
// Style variants with CVA
// ---------------------------------------------------------------------------

const tabButtonVariants = cva(
  "flex cursor-pointer items-center justify-center rounded-sm border transition-colors",
  {
    variants: {
      active: {
        true: "border-primary bg-primary text-primary-foreground",
        false: "border-border text-muted-foreground hover:bg-accent",
      },
      layout: {
        horizontal: "gap-2 py-3",
        vertical: "flex-col py-4",
      },
    },
    defaultVariants: {
      active: false,
      layout: "horizontal",
    },
  },
);

const errorTextVariants = cva(
  "ml-1 animate-in font-medium text-destructive slide-in-from-left-1",
  {
    variants: {
      size: {
        xs: "text-[10px]",
        sm: "text-[10px]",
        md: "text-xs",
        lg: "text-xs",
        xl: "text-sm",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const descriptionTextVariants = cva("text-input-foreground/60 ml-1", {
  variants: {
    size: {
      xs: "text-[9px]",
      sm: "text-[9px]",
      md: "text-[10px]",
      lg: "text-[10px]",
      xl: "text-xs",
    },
  },
  defaultVariants: { size: "md" },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TabFieldOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface TabFieldProps
  extends VariantProps<typeof errorTextVariants>, FieldProps {
  /** Available tab options. */
  options: TabFieldOption[];
  /** Current value. */
  value?: string;
  /** Callback fired when the value changes. */
  onValueChange?: (value: string) => void;
  /** Layout direction for tab items. */
  layout?: "horizontal" | "vertical";
  /** Number of grid columns (defaults to options.length). */
  columns?: number;
  /** Whether the entire field is disabled. */
  disabled?: boolean;
  /** Additional class names for the grid container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function TabField({
  options,
  value,
  onValueChange,
  label,
  error,
  description,
  layout = "horizontal",
  columns,
  disabled,
  required,
  wrapperClassName,
  labelClassName,
  labelExtra,
  className,
  size,
  render,
}: TabFieldProps) {
  const hasError = !!error;
  const gridCols = columns ?? options.length;

  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      {(label || labelExtra) && (
        <div className="flex items-center justify-between">
          <Label
            size={size}
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
          className={cn("grid gap-3", className)}
          style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
        >
          {options.map((option) => {
            const isActive = value === option.value;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onValueChange?.(option.value)}
                disabled={disabled || option.disabled}
                className={tabButtonVariants({ active: isActive, layout })}
              >
                {Icon && layout === "vertical" && (
                  <Icon className="mb-2 text-base" />
                )}
                {Icon && layout === "horizontal" && (
                  <Icon className="text-sm" />
                )}
                <span
                  className={cn(
                    "font-semibold",
                    layout === "vertical"
                      ? "text-[10px] uppercase"
                      : "text-xs uppercase",
                  )}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </RenderWrapper>

      {hasError ? (
        <p className={errorTextVariants({ size })}>{error}</p>
      ) : (
        description && (
          <p className={descriptionTextVariants({ size })}>{description}</p>
        )
      )}
    </div>
  );
}

TabField.displayName = "TabField";

export { TabField };
