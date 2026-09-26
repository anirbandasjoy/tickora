"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const labelVariants = cva(
  "flex items-center leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        success: "text-success",
        destructive: "text-destructive",
        warning: "text-warning",
        field: "text-input-foreground",
        muted: "text-muted-foreground",
      },
      size: {
        xs: "gap-1.5 text-xs",
        sm: "gap-1.5 text-xs",
        md: "gap-2 text-sm",
        lg: "gap-2 text-sm",
        xl: "gap-2 text-base",
        icon: "gap-1.5 text-xs",
        "icon-sm": "gap-1.5 text-xs",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      appearance: {
        // প্যাডিং বাড়ানো হয়েছে: px-1.5 py-0.5 থেকে px-2.5 py-1 করা হয়েছে
        solid: "rounded-sm border border-transparent px-2.5 py-1",
        ghost: "rounded-sm border border-transparent px-2.5 py-1",
        fade: "rounded-sm border border-transparent px-2.5 py-1",
        outline: "rounded-sm border bg-transparent px-2.5 py-1",
      },
    },
    compoundVariants: [
      // ============ OUTLINE APPEARANCE ============
      {
        variant: "default",
        appearance: "outline",
        className: "border-border text-foreground",
      },
      {
        variant: "primary",
        appearance: "outline",
        className: "border-primary/30 text-primary",
      },
      {
        variant: "secondary",
        appearance: "outline",
        className: "border-input text-secondary-foreground",
      },
      {
        variant: "success",
        appearance: "outline",
        className: "border-success/30 text-success",
      },
      {
        variant: "destructive",
        appearance: "outline",
        className: "border-destructive/30 text-destructive",
      },
      {
        variant: "warning",
        appearance: "outline",
        className: "border-warning/30 text-warning",
      },
      {
        variant: "field",
        appearance: "outline",
        className: "border-field-foreground/20 text-input-foreground",
      },
      {
        variant: "muted",
        appearance: "outline",
        className: "border-border text-muted-foreground",
      },
      // ============ SOLID APPEARANCE ============
      {
        variant: "primary",
        appearance: "solid",
        className: "bg-primary text-primary-foreground",
      },
      {
        variant: "secondary",
        appearance: "solid",
        className: "bg-secondary text-secondary-foreground",
      },
      {
        variant: "success",
        appearance: "solid",
        className: "bg-success text-success-foreground",
      },
      {
        variant: "destructive",
        appearance: "solid",
        className: "bg-destructive text-destructive-foreground",
      },
      {
        variant: "warning",
        appearance: "solid",
        className: "bg-warning text-warning-foreground",
      },
      // ============ GHOST APPEARANCE ============
      {
        variant: "primary",
        appearance: "ghost",
        className: "bg-primary/5 text-primary",
      },
      {
        variant: "success",
        appearance: "ghost",
        className: "bg-success/5 text-success",
      },
      {
        variant: "destructive",
        appearance: "ghost",
        className: "bg-destructive/5 text-destructive",
      },
      {
        variant: "warning",
        appearance: "ghost",
        className: "bg-warning/5 text-warning",
      },
      {
        variant: "muted",
        appearance: "ghost",
        className: "bg-muted text-muted-foreground",
      },
      // ============ FADE APPEARANCE ============
      {
        variant: "primary",
        appearance: "fade",
        className: "bg-primary/10 text-primary",
      },
      {
        variant: "success",
        appearance: "fade",
        className: "bg-success/10 text-success",
      },
      {
        variant: "destructive",
        appearance: "fade",
        className: "bg-destructive/10 text-destructive",
      },
      {
        variant: "warning",
        appearance: "fade",
        className: "bg-warning/10 text-warning",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      weight: "medium",
    },
  },
);

export type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    required?: boolean;
    icon?: React.ReactNode;
  };

function Label({
  className,
  variant,
  size,
  weight,
  appearance,
  required,
  icon,
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        labelVariants({ variant, size, weight, appearance }),
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {required && <span className="text-destructive">*</span>}
    </LabelPrimitive.Root>
  );
}

export { Label, labelVariants };
