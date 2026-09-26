import * as React from "react";

import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "w-full min-w-0  rounded-md border shadow-none transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground  file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ",
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
        xs: "h-8 px-2.5 py-1.5 text-xs",
        sm: "h-9 px-3 py-1.5 text-sm",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-3.5 py-2 text-base",
        xl: "h-14 px-4 py-2 text-base",
      },
    },
    compoundVariants: [
      // ============ PRIMARY VARIANT ============
      {
        variant: "primary",
        appearance: "solid",
        className:
          "border-primary/20 bg-primary/5 text-foreground placeholder:text-primary/60 focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10 dark:bg-primary/10",
      },
      {
        variant: "primary",
        appearance: "outline",
        className:
          "border-primary/50 bg-background text-foreground placeholder:text-primary/60 focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10",
      },
      {
        variant: "primary",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-primary/30 bg-transparent px-0 text-foreground placeholder:text-primary/60 focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0",
      },

      // ============ SECONDARY VARIANT ============
      {
        variant: "secondary",
        appearance: "solid",
        className:
          "border-secondary bg-secondary text-secondary-foreground focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10",
      },
      {
        variant: "secondary",
        appearance: "outline",
        className:
          "border-secondary bg-background text-foreground focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10",
      },
      {
        variant: "secondary",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-secondary/30 bg-transparent px-0 text-foreground focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0",
      },

      // ============ SUCCESS VARIANT ============
      {
        variant: "success",
        appearance: "solid",
        className:
          "border-success/20 bg-success/5 text-foreground placeholder:text-success/60 focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10 dark:bg-success/10",
      },
      {
        variant: "success",
        appearance: "outline",
        className:
          "border-success bg-background text-foreground placeholder:text-success/60 focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10",
      },
      {
        variant: "success",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-success/30 bg-transparent px-0 text-foreground placeholder:text-success/60 focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0",
      },

      // ============ DESTRUCTIVE VARIANT ============
      {
        variant: "destructive",
        appearance: "solid",
        className:
          "border-destructive/20 bg-destructive/5 text-foreground placeholder:text-destructive/60 focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10 dark:bg-destructive/10",
      },
      {
        variant: "destructive",
        appearance: "outline",
        className:
          "border-destructive bg-background text-foreground placeholder:text-destructive/60 focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10",
      },
      {
        variant: "destructive",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-destructive/30 bg-transparent px-0 text-foreground placeholder:text-destructive/60 focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0",
      },

      // ============ WARNING VARIANT ============
      {
        variant: "warning",
        appearance: "solid",
        className:
          "border-warning/20 bg-warning/5 text-foreground placeholder:text-warning/60 focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10 dark:bg-warning/10",
      },
      {
        variant: "warning",
        appearance: "outline",
        className:
          "border-warning bg-background text-foreground placeholder:text-warning/60 focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10",
      },
      {
        variant: "warning",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-warning/30 bg-transparent px-0 text-foreground placeholder:text-warning/60 focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0",
      },

      // ============ DEFAULT VARIANT ============
      {
        variant: "default",
        appearance: "solid",
        className:
          "border bg-card focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10",
      },
      {
        variant: "default",
        appearance: "outline",
        className:
          "border-primary/30 bg-background text-foreground focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10 dark:border-border",
      },
      {
        variant: "default",
        appearance: "inline",
        className:
          "rounded-none border-0 border-b border-primary/20 bg-transparent px-0 text-foreground focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0 dark:border-border",
      },

      // ============ FIELD VARIANT ============
      {
        variant: "field",
        appearance: "solid",
        className:
          "border-field-foreground/20 text-input-foreground placeholder:text-input-foreground/60 rounded-sm bg-input shadow-none focus-visible:border-primary focus-visible:bg-background focus-visible:ring-[1px] focus-visible:ring-primary/10 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      },
      {
        variant: "field",
        appearance: "outline",
        className:
          "border-field-foreground/20 text-input-foreground placeholder:text-input-foreground/60 rounded-sm bg-background shadow-none focus-visible:border-primary focus-visible:ring-[1px] focus-visible:ring-primary/10 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      },
      {
        variant: "field",
        appearance: "inline",
        className:
          "border-field-foreground/20 text-input-foreground placeholder:text-input-foreground/60 rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:border-b-2 focus-visible:border-primary focus-visible:ring-0 aria-invalid:border-destructive",
      },
    ],
    defaultVariants: {
      variant: "default",
      appearance: "solid",
      size: "md",
    },
  },
);

export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>;

function Input({
  className,
  type,
  size,
  variant,
  appearance,
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, variant, appearance }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
