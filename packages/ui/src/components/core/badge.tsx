import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-full border font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "",
        default: "",
        secondary: "",
        success: "",
        destructive: "",
        warning: "",
        dim: "",
        field: "",
      },
      appearance: {
        solid: "",
        ghost: "",
        outline: "",
        fade: "",
      },
      size: {
        xs: "gap-0.5 px-1.5 py-0.5 text-xs [&>svg]:size-2.5",
        sm: "gap-1 px-2 py-0.5 text-xs [&>svg]:size-3",
        md: "gap-1 px-2.5 py-1 text-xs [&>svg]:size-3",
        lg: "gap-1.5 px-3 py-1 text-sm [&>svg]:size-3.5",
      },
    },
    compoundVariants: [
      // ============ SOLID APPEARANCE ============
      {
        variant: "primary",
        appearance: "solid",
        className:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
      },
      {
        variant: "default",
        appearance: "solid",
        className:
          "border-transparent text-primary text-primary-foreground dark:bg-muted dark:text-foreground [a&]:hover:bg-primary/90 dark:[a&]:hover:bg-muted/90",
      },
      {
        variant: "secondary",
        appearance: "solid",
        className:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
      },
      {
        variant: "success",
        appearance: "solid",
        className:
          "border-transparent bg-success text-success-foreground [a&]:hover:bg-success/90",
      },
      {
        variant: "destructive",
        appearance: "solid",
        className:
          "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90",
      },
      {
        variant: "warning",
        appearance: "solid",
        className:
          "border-transparent bg-warning text-warning-foreground [a&]:hover:bg-warning/90",
      },
      {
        variant: "dim",
        appearance: "solid",
        className:
          "border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/80",
      },
      {
        variant: "field",
        appearance: "solid",
        className:
          "border-field-foreground/20 text-input-foreground bg-input [a&]:hover:bg-input/80",
      },

      // ============ GHOST APPEARANCE ============
      {
        variant: "primary",
        appearance: "ghost",
        className:
          "border-transparent bg-transparent text-primary [a&]:hover:bg-primary/5",
      },
      {
        variant: "default",
        appearance: "ghost",
        className:
          "border-transparent bg-transparent text-primary dark:text-muted-foreground [a&]:hover:bg-primary/5 dark:[a&]:hover:bg-muted/10",
      },
      {
        variant: "secondary",
        appearance: "ghost",
        className:
          "border-transparent bg-transparent text-secondary-foreground [a&]:hover:bg-secondary/80",
      },
      {
        variant: "success",
        appearance: "ghost",
        className:
          "border-transparent bg-transparent text-success [a&]:hover:bg-success/5",
      },
      {
        variant: "destructive",
        appearance: "ghost",
        className:
          "border-transparent bg-transparent text-destructive [a&]:hover:bg-destructive/5",
      },
      {
        variant: "warning",
        appearance: "ghost",
        className:
          "border-transparent bg-transparent text-warning [a&]:hover:bg-warning/5",
      },
      {
        variant: "dim",
        appearance: "ghost",
        className:
          "border-transparent bg-transparent text-muted-foreground [a&]:hover:bg-muted",
      },
      {
        variant: "field",
        appearance: "ghost",
        className:
          "text-input-foreground border-transparent bg-transparent [a&]:hover:bg-input",
      },

      // ============ OUTLINE APPEARANCE ============
      {
        variant: "primary",
        appearance: "outline",
        className:
          "border-primary/20 bg-background text-primary [a&]:hover:bg-primary/5",
      },
      {
        variant: "default",
        appearance: "outline",
        className:
          "border-primary/20 bg-background text-primary dark:border-border dark:text-muted-foreground [a&]:hover:bg-primary/5 dark:[a&]:hover:bg-muted/10",
      },
      {
        variant: "secondary",
        appearance: "outline",
        className:
          "border-input bg-background text-secondary-foreground [a&]:hover:bg-accent",
      },
      {
        variant: "success",
        appearance: "outline",
        className:
          "border-success/20 bg-background text-success [a&]:hover:bg-success/5",
      },
      {
        variant: "destructive",
        appearance: "outline",
        className:
          "border-destructive/20 bg-background text-destructive [a&]:hover:bg-destructive/5",
      },
      {
        variant: "warning",
        appearance: "outline",
        className:
          "border-warning/20 bg-background text-warning [a&]:hover:bg-warning/5",
      },
      {
        variant: "dim",
        appearance: "outline",
        className:
          "border-input bg-background text-muted-foreground [a&]:hover:bg-accent",
      },
      {
        variant: "field",
        appearance: "outline",
        className:
          "border-field-foreground/20 [a&]:hover:border-field-foreground/30 text-input-foreground bg-background [a&]:hover:bg-input",
      },

      // ============ FADE APPEARANCE ============
      {
        variant: "primary",
        appearance: "fade",
        className:
          "border-transparent bg-primary/10 text-primary [a&]:hover:bg-primary/15",
      },
      {
        variant: "default",
        appearance: "fade",
        className:
          "border-transparent bg-primary/10 text-primary dark:bg-muted/10 dark:text-muted-foreground [a&]:hover:text-primary/15 dark:[a&]:hover:bg-muted/15",
      },
      {
        variant: "secondary",
        appearance: "fade",
        className:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
      },
      {
        variant: "success",
        appearance: "fade",
        className:
          "border-transparent bg-success/10 text-success [a&]:hover:bg-success/15",
      },
      {
        variant: "destructive",
        appearance: "fade",
        className:
          "border-transparent bg-destructive/10 text-destructive [a&]:hover:bg-destructive/15",
      },
      {
        variant: "warning",
        appearance: "fade",
        className:
          "border-transparent bg-warning/10 text-warning [a&]:hover:bg-warning/15",
      },
      {
        variant: "dim",
        appearance: "fade",
        className:
          "border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/80",
      },
      {
        variant: "field",
        appearance: "fade",
        className:
          "text-input-foreground border-transparent bg-input/80 [a&]:hover:bg-input",
      },
    ],
    defaultVariants: {
      variant: "primary",
      appearance: "solid",
      size: "md",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean };

function Badge({
  className,
  variant,
  appearance,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, appearance, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
