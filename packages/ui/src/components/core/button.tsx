import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, Loader2, LucideIcon } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "group inline-flex cursor-pointer items-center justify-center text-sm font-medium whitespace-nowrap ring-offset-background transition-[color,box-shadow,background-color] focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-60 has-data-[arrow=true]:justify-between [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        secondary: "",
        success: "",
        destructive: "",
        warning: "",
        dim: "text-muted-foreground hover:text-foreground data-[state=open]:text-foreground",
        field: "",
      },
      appearance: {
        solid: "",
        ghost: "",
        outline: "",
        fade: "",
      },
      underline: {
        solid: "",
        dashed: "",
      },
      underlined: {
        solid: "",
        dashed: "",
      },
      size: {
        xl: "h-14 gap-1.5 px-7 text-sm [&_svg:not([class*=size-])]:size-4",
        lg: "h-12 gap-1.5 px-6 text-sm [&_svg:not([class*=size-])]:size-4",
        md: "h-10 gap-1.5 px-5 text-sm [&_svg:not([class*=size-])]:size-3.5",
        sm: "h-9 gap-1.25 px-4 text-xs [&_svg:not([class*=size-])]:size-3.5",
        xs: "h-8 gap-1 px-3 text-xs [&_svg:not([class*=size-])]:size-3.5",
        icon: "size-10 shrink-0 p-0 [&_svg:not([class*=size-])]:size-4",
        "icon-sm": "size-8 shrink-0 p-0 [&_svg:not([class*=size-])]:size-3.5",
      },
      autoHeight: {
        true: "",
        false: "",
      },
      radius: {
        md: "rounded-sm",
        full: "rounded-full",
      },
      mode: {
        default:
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        icon: "shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        link: "h-auto rounded-none bg-transparent p-0 hover:bg-transparent data-[state=open]:bg-transparent",
        input: `justify-start font-normal hover:bg-background focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:outline-hidden in-data-[invalid=true]:border-destructive/60 in-data-[invalid=true]:ring-destructive/10 aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 data-[state=open]:bg-background dark:in-data-[invalid=true]:border-destructive dark:in-data-[invalid=true]:ring-destructive/20 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20 [&_svg]:transition-colors [&_svg]:hover:text-foreground [[data-state=open]>&]:border-ring [[data-state=open]>&]:ring-[3px] [[data-state=open]>&]:ring-ring/30 [[data-state=open]>&]:outline-hidden`,
      },
      placeholder: {
        true: "text-muted-foreground",
        false: "",
      },
    },
    compoundVariants: [
      // ============ SOLID APPEARANCE ============
      {
        variant: "default",
        appearance: "solid",
        className:
          "border bg-card text-foreground hover:border-border hover:bg-muted data-[state=open]:bg-muted dark:hover:border-border dark:hover:bg-muted dark:data-[state=open]:bg-muted",
      },
      {
        variant: "primary",
        appearance: "solid",
        className:
          "bg-primary text-primary-foreground hover:bg-primary/90 data-[state=open]:bg-primary/90",
      },
      {
        variant: "secondary",
        appearance: "solid",
        className:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 data-[state=open]:bg-secondary/90 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "success",
        appearance: "solid",
        className:
          "bg-success text-success-foreground hover:bg-success/90 data-[state=open]:bg-success/90",
      },
      {
        variant: "destructive",
        appearance: "solid",
        className:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 data-[state=open]:bg-destructive/90",
      },
      {
        variant: "warning",
        appearance: "solid",
        className:
          "bg-warning text-warning-foreground hover:bg-warning/90 data-[state=open]:bg-warning/90",
      },

      // ============ GHOST APPEARANCE ============
      {
        variant: "default",
        appearance: "ghost",
        className: "bg-transparent hover:bg-muted dark:hover:bg-muted",
      },
      {
        variant: "primary",
        appearance: "ghost",
        className:
          "bg-transparent text-primary hover:bg-primary/5 data-[state=open]:bg-primary/5",
      },
      {
        variant: "secondary",
        appearance: "ghost",
        className:
          "bg-transparent text-secondary-foreground hover:bg-secondary/80 data-[state=open]:bg-secondary/80",
      },
      {
        variant: "success",
        appearance: "ghost",
        className:
          "bg-transparent text-success hover:bg-success/5 data-[state=open]:bg-success/5",
      },
      {
        variant: "destructive",
        appearance: "ghost",
        className:
          "bg-transparent text-destructive hover:bg-destructive/5 data-[state=open]:bg-destructive/5",
      },
      {
        variant: "warning",
        appearance: "ghost",
        className:
          "bg-transparent text-warning hover:bg-warning/5 data-[state=open]:bg-warning/5",
      },
      {
        variant: "dim",
        appearance: "ghost",
        className:
          "[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },

      // ============ OUTLINE APPEARANCE ============
      {
        variant: "default",
        appearance: "outline",
        className:
          "border bg-transparent hover:border-border data-[state=open]:border-border dark:hover:border-border dark:data-[state=open]:border-border",
      },
      {
        variant: "primary",
        appearance: "outline",
        className:
          "border border-primary/20 bg-background text-primary hover:bg-primary/5 data-[state=open]:bg-primary/5 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "secondary",
        appearance: "outline",
        className:
          "border border-input bg-background text-accent-foreground hover:bg-accent data-[state=open]:bg-accent [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "success",
        appearance: "outline",
        className:
          "border border-success/20 bg-background text-success hover:bg-success/5 data-[state=open]:bg-success/5 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "destructive",
        appearance: "outline",
        className:
          "border border-destructive/20 bg-background text-destructive hover:bg-destructive/5 data-[state=open]:bg-destructive/5 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "warning",
        appearance: "outline",
        className:
          "border border-warning/20 bg-background text-warning hover:bg-warning/5 data-[state=open]:bg-warning/5 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "dim",
        appearance: "outline",
        className:
          "border border-input bg-background hover:bg-accent data-[state=open]:bg-accent [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },

      // ============ FIELD VARIANT ============
      {
        variant: "field",
        appearance: "solid",
        className:
          "border-field-foreground/20 data-[state=open]:border-field-foreground/30 text-input-foreground/70 border bg-input hover:bg-input/80 data-[state=open]:bg-input/80",
      },
      {
        variant: "field",
        appearance: "ghost",
        className:
          "text-input-foreground/70 bg-transparent hover:bg-input data-[state=open]:bg-input [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "field",
        appearance: "outline",
        className:
          "border-field-foreground/20 hover:border-field-foreground/30 data-[state=open]:border-field-foreground/30 text-input-foreground/70 border bg-background hover:bg-input data-[state=open]:bg-input [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },

      // ============ FADE APPEARANCE ============
      {
        variant: "default",
        appearance: "fade",
        className:
          "bg-foreground/5 hover:bg-foreground/10 data-[state=open]:bg-foreground/10",
      },
      {
        variant: "primary",
        appearance: "fade",
        className:
          "bg-primary/10 text-primary hover:bg-primary/15 data-[state=open]:bg-primary/15 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "secondary",
        appearance: "fade",
        className:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=open]:bg-secondary/80 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "success",
        appearance: "fade",
        className:
          "bg-success/10 text-success hover:bg-success/15 data-[state=open]:bg-success/15 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "destructive",
        appearance: "fade",
        className:
          "bg-destructive/10 text-destructive hover:bg-destructive/15 data-[state=open]:bg-destructive/15 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "warning",
        appearance: "fade",
        className:
          "bg-warning/10 text-warning hover:bg-warning/15 data-[state=open]:bg-warning/15 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "dim",
        appearance: "fade",
        className:
          "bg-muted hover:bg-muted/80 data-[state=open]:bg-muted/80 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },
      {
        variant: "field",
        appearance: "fade",
        className:
          "text-input-foreground/70 bg-input/80 hover:bg-input data-[state=open]:bg-input [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60",
      },

      // ============ AUTO HEIGHT ============
      {
        size: "xs",
        autoHeight: true,
        className: "h-auto min-h-8",
      },
      {
        size: "sm",
        autoHeight: true,
        className: "h-auto min-h-9",
      },
      {
        size: "md",
        autoHeight: true,
        className: "h-auto min-h-10",
      },
      {
        size: "lg",
        autoHeight: true,
        className: "h-auto min-h-12",
      },
      {
        size: "xl",
        autoHeight: true,
        className: "h-auto min-h-14",
      },

      // ============ LINK MODE ============
      {
        variant: "primary",
        mode: "link",
        underline: "solid",
        className:
          "font-medium text-primary hover:text-primary/90 hover:underline hover:decoration-solid hover:underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        variant: "primary",
        mode: "link",
        underline: "dashed",
        className:
          "font-medium text-primary decoration-1 hover:text-primary/90 hover:underline hover:decoration-dashed hover:underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        variant: "primary",
        mode: "link",
        underlined: "solid",
        className:
          "font-medium text-primary underline decoration-solid underline-offset-4 hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        variant: "primary",
        mode: "link",
        underlined: "dashed",
        className:
          "font-medium text-primary underline decoration-dashed decoration-1 underline-offset-4 hover:text-primary/90 [&_svg]:opacity-60",
      },
      {
        variant: "default",
        mode: "link",
        underline: "solid",
        className:
          "font-medium text-foreground hover:underline hover:decoration-solid hover:underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        variant: "default",
        mode: "link",
        underline: "dashed",
        className:
          "font-medium text-foreground decoration-1 hover:underline hover:decoration-dashed hover:underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        variant: "default",
        mode: "link",
        underlined: "solid",
        className:
          "font-medium text-foreground underline decoration-solid underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        variant: "default",
        mode: "link",
        underlined: "dashed",
        className:
          "font-medium text-foreground underline decoration-dashed decoration-1 underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        variant: "destructive",
        mode: "link",
        underline: "solid",
        className:
          "font-medium text-destructive hover:text-destructive/90 hover:underline hover:decoration-solid hover:underline-offset-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },
      {
        variant: "destructive",
        mode: "link",
        underlined: "solid",
        className:
          "font-medium text-destructive underline decoration-solid underline-offset-4 hover:text-destructive/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
      },

      // ============ ICON MODE SIZES ============
      {
        size: "xs",
        mode: "icon",
        className: "size-8 p-0 [&_svg:not([class*=size-])]:size-4",
      },
      {
        size: "sm",
        mode: "icon",
        className: "size-9 p-0 [&_svg:not([class*=size-])]:size-5",
      },
      {
        size: "md",
        mode: "icon",
        className: "size-10 p-0 [&_svg:not([class*=size-])]:size-6",
      },
      {
        size: "lg",
        mode: "icon",
        className: "size-12 p-0 [&_svg:not([class*=size-])]:size-7",
      },
      {
        size: "xl",
        mode: "icon",
        className: "size-14 p-0 [&_svg:not([class*=size-])]:size-8",
      },

      // ============ ICON MODE + GHOST ============
      {
        appearance: "ghost",
        mode: "icon",
        className: "text-muted-foreground",
      },

      // ============ INPUT MODE ============
      {
        mode: "input",
        appearance: "outline",
        placeholder: true,
        className: "font-normal text-muted-foreground",
      },
      {
        mode: "input",
        appearance: "outline",
        size: "sm",
        className: "gap-1.25",
      },
      {
        mode: "input",
        appearance: "outline",
        size: "md",
        className: "gap-1.5",
      },
      {
        mode: "input",
        appearance: "outline",
        size: "lg",
        className: "gap-1.5",
      },
    ],
    defaultVariants: {
      variant: "default",
      mode: "default",
      size: "md",
      radius: "md",
      appearance: "solid",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    selected?: boolean;
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
  };

function Button({
  className,
  selected,
  variant = "primary",
  radius,
  appearance = "solid",
  mode,
  size,
  autoHeight,
  underlined,
  underline,
  asChild = false,
  placeholder = false,
  isLoading = false,
  children,
  disabled,
  loadingText,
  ...props
}: ButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";
  const Children = isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {loadingText || "Loading..."}
    </>
  ) : (
    children
  );
  const isDisabled = disabled || isLoading;
  return (
    <Comp
      data-slot="button"
      disabled={isDisabled}
      className={cn(
        buttonVariants({
          variant,
          size,
          radius,
          appearance,
          mode,
          autoHeight,
          placeholder,
          underlined,
          underline,
          className,
        }),
        asChild && isDisabled && "pointer-events-none opacity-50",
      )}
      {...(selected && { "data-state": "open" })}
      {...props}
    >
      {Children}
    </Comp>
  );
}

interface ButtonArrowProps extends React.SVGProps<SVGSVGElement> {
  icon?: LucideIcon; // Allows passing any Lucide icon
}

function ButtonArrow({
  icon: Icon = ChevronDown,
  className,
  ...props
}: ButtonArrowProps) {
  return (
    <Icon
      data-slot="button-arrow"
      className={cn("ms-auto -me-1", className)}
      {...props}
    />
  );
}

export { Button, ButtonArrow, buttonVariants };
