"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex w-full items-center gap-2 has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

const inputOTPGroupVariants = cva("flex w-full items-center justify-between", {
  variants: {
    spacing: {
      default: "gap-2",
      spaced: "gap-3",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

function InputOTPGroup({
  className,
  spacing,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputOTPGroupVariants>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(inputOTPGroupVariants({ spacing }), className)}
      {...props}
    />
  );
}

const inputOTPSlotVariants = cva(
  "relative flex min-w-0 flex-1 items-center justify-center border shadow-none transition-all outline-none data-[active=true]:z-10",
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
        solid: "rounded-md",
        outline: "rounded-md",
        inline: "rounded-none border-0 border-b px-0",
      },
      size: {
        sm: "h-9 text-sm",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        appearance: "solid",
        className:
          "border-primary/20 bg-primary/5 data-[active=true]:border-primary data-[active=true]:ring-[1px] data-[active=true]:ring-primary/10",
      },
      {
        variant: "primary",
        appearance: "outline",
        className:
          "border-primary/50 bg-background data-[active=true]:border-primary data-[active=true]:ring-[1px] data-[active=true]:ring-primary/10",
      },
      {
        variant: "success",
        appearance: "solid",
        className:
          "border-success/20 bg-success/5 data-[active=true]:border-primary data-[active=true]:ring-[1px] data-[active=true]:ring-primary/10",
      },
      {
        variant: "destructive",
        appearance: "solid",
        className:
          "border-destructive/20 bg-destructive/5 data-[active=true]:border-primary data-[active=true]:ring-[1px] data-[active=true]:ring-primary/10",
      },
      {
        variant: "field",
        appearance: "solid",
        className:
          "border-field-foreground/20 bg-input data-[active=true]:border-primary data-[active=true]:bg-background",
      },
    ],
    defaultVariants: {
      variant: "default",
      appearance: "solid",
      size: "md",
    },
  },
);

interface InputOTPSlotProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof inputOTPSlotVariants> {
  index: number;
}

function InputOTPSlot({
  index,
  className,
  variant,
  appearance,
  size,
  ...props
}: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        inputOTPSlotVariants({ variant, appearance, size }),
        appearance === "inline" && isActive && "border-b-2 border-primary",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-primary duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
    </div>
  );
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  inputOTPGroupVariants,
  inputOTPSlotVariants,
};
