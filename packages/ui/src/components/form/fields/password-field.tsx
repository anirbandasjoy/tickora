"use client";

import { Eye, EyeOff, Lock, type LucideIcon } from "lucide-react";
import * as React from "react";
import { Button } from "../../core/button";
import { TextField, type TextFieldProps } from "./text-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PasswordFieldProps
  extends Omit<TextFieldProps, "type" | "endAdornment"> {
  /** Leading icon. Defaults to a lock. */
  icon?: LucideIcon;
  /** Start with the password visible. @default false */
  defaultVisible?: boolean;
  /** Accessible labels for the visibility toggle. */
  toggleAriaLabels?: { show: string; hide: string };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      icon: Icon = Lock,
      defaultVisible = false,
      toggleAriaLabels = { show: "Show password", hide: "Hide password" },
      autoComplete = "current-password",
      ...rest
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(defaultVisible);

    return (
      <TextField
        ref={ref}
        type={visible ? "text" : "password"}
        icon={Icon}
        autoComplete={autoComplete}
        endAdornment={
          <Button
            type="button"
            size="icon-sm"
            appearance="ghost"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? toggleAriaLabels.hide : toggleAriaLabels.show}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        }
        {...rest}
      />
    );
  },
);

PasswordField.displayName = "PasswordField";

export { PasswordField };
