"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const checkboxVariants = cva(
  "peer shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        success: "",
        destructive: "",
        warning: "",
        default: "",
        field: "",
      },
      appearance: {
        solid: "",
        outline: "",
        inline: "",
      },
      size: {
        xs: "size-3",
        sm: "size-3.5",
        md: "size-4",
        lg: "size-5",
        xl: "size-6",
      },
    },
    compoundVariants: [
      // ============ PRIMARY VARIANT ============
      {
        variant: "primary",
        appearance: "solid",
        className:
          "border-primary/20 bg-primary/5 text-foreground focus-visible:border-primary focus-visible:ring-primary/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-primary/10 dark:data-[state=checked]:bg-primary",
      },
      {
        variant: "primary",
        appearance: "outline",
        className:
          "border-primary/50 bg-background text-foreground focus-visible:border-primary focus-visible:ring-primary/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary",
      },
      {
        variant: "primary",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-primary/30 bg-transparent px-0 text-foreground focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary",
      },

      // ============ SECONDARY VARIANT ============
      {
        variant: "secondary",
        appearance: "solid",
        className:
          "border-secondary bg-secondary text-secondary-foreground focus-visible:border-secondary focus-visible:ring-secondary/20 data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground",
      },
      {
        variant: "secondary",
        appearance: "outline",
        className:
          "border-secondary bg-background text-foreground focus-visible:border-secondary focus-visible:ring-secondary/20 data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground",
      },
      {
        variant: "secondary",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-secondary/30 bg-transparent px-0 text-foreground focus-visible:border-b-2 focus-visible:border-secondary focus-visible:ring-0 data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground",
      },

      // ============ SUCCESS VARIANT ============
      {
        variant: "success",
        appearance: "solid",
        className:
          "border-success/20 bg-success/5 text-foreground focus-visible:border-success focus-visible:ring-success/20 data-[state=checked]:bg-success data-[state=checked]:text-success-foreground dark:bg-success/10",
      },
      {
        variant: "success",
        appearance: "outline",
        className:
          "border-success bg-background text-foreground focus-visible:border-success focus-visible:ring-success/20 data-[state=checked]:bg-success data-[state=checked]:text-success-foreground",
      },
      {
        variant: "success",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-success/30 bg-transparent px-0 text-foreground focus-visible:border-b-2 focus-visible:border-success focus-visible:ring-0 data-[state=checked]:bg-success data-[state=checked]:text-success-foreground",
      },

      // ============ DESTRUCTIVE VARIANT ============
      {
        variant: "destructive",
        appearance: "solid",
        className:
          "border-destructive/20 bg-destructive/5 text-foreground focus-visible:border-destructive focus-visible:ring-destructive/20 data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground dark:bg-destructive/10",
      },
      {
        variant: "destructive",
        appearance: "outline",
        className:
          "border-destructive bg-background text-foreground focus-visible:border-destructive focus-visible:ring-destructive/20 data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
      },
      {
        variant: "destructive",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-destructive/30 bg-transparent px-0 text-foreground focus-visible:border-b-2 focus-visible:border-destructive focus-visible:ring-0 data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
      },

      // ============ WARNING VARIANT ============
      {
        variant: "warning",
        appearance: "solid",
        className:
          "border-warning/20 bg-warning/5 text-foreground focus-visible:border-warning focus-visible:ring-warning/20 data-[state=checked]:bg-warning data-[state=checked]:text-warning-foreground dark:bg-warning/10",
      },
      {
        variant: "warning",
        appearance: "outline",
        className:
          "border-warning bg-background text-foreground focus-visible:border-warning focus-visible:ring-warning/20 data-[state=checked]:bg-warning data-[state=checked]:text-warning-foreground",
      },
      {
        variant: "warning",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-warning/30 bg-transparent px-0 text-foreground focus-visible:border-b-2 focus-visible:border-warning focus-visible:ring-0 data-[state=checked]:bg-warning data-[state=checked]:text-warning-foreground",
      },

      // ============ DEFAULT VARIANT ============
      {
        variant: "default",
        appearance: "solid",
        className:
          "border bg-card hover:border-border focus-visible:border-ring focus-visible:ring-ring/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:hover:border-border dark:data-[state=checked]:bg-primary",
      },
      {
        variant: "default",
        appearance: "outline",
        className:
          "border-primary/30 bg-background text-foreground focus-visible:border-primary focus-visible:ring-zinc-950/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-border dark:focus-visible:border-border dark:focus-visible:ring-zinc-300/20 dark:data-[state=checked]:bg-primary",
      },
      {
        variant: "default",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-primary/20 bg-transparent px-0 text-foreground focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-border dark:focus-visible:border-border dark:data-[state=checked]:bg-primary",
      },

      // ============ FIELD VARIANT ============
      {
        variant: "field",
        appearance: "solid",
        className:
          "border-field-foreground/20 focus-visible:border-field-foreground text-input-foreground focus-visible:ring-input-foreground/5 rounded-sm bg-input shadow-none focus-visible:bg-background focus-visible:ring-4 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:aria-invalid:ring-destructive/40",
      },
      {
        variant: "field",
        appearance: "outline",
        className:
          "border-field-foreground/20 focus-visible:border-field-foreground text-input-foreground focus-visible:ring-input-foreground/5 rounded-sm bg-background shadow-none focus-visible:ring-4 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:aria-invalid:ring-destructive/40",
      },
      {
        variant: "field",
        appearance: "inline",
        className:
          "border-field-foreground/20 focus-visible:border-field-foreground text-input-foreground rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:border-b-2 focus-visible:ring-0 aria-invalid:border-destructive data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
      appearance: "solid",
      size: "md",
    },
  },
);

export type CheckboxProps = Omit<
  React.ComponentProps<typeof CheckboxPrimitive.Root>,
  "size"
> &
  VariantProps<typeof checkboxVariants>;

function Checkbox({
  className,
  size,
  variant,
  appearance,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ size, variant, appearance }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5 text-current" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };
