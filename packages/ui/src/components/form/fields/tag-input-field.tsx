"use client";

import { X } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../core/badge";
import { Button } from "../../core/button";
import { type FieldProps } from "./shared";
import { TextField, type TextFieldProps } from "./text-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TagInputFieldProps
  extends
    Omit<FieldProps, "render">,
    Pick<TextFieldProps, "variant" | "appearance" | "size"> {
  /** Current array of tags. */
  value?: string[];
  /** Called when the tag list changes. */
  onChange?: (tags: string[]) => void;
  /** Called when the field loses focus. */
  onBlur?: () => void;
  /** Placeholder for the text input. */
  placeholder?: string;
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Maximum number of tags allowed. */
  maxTags?: number;
  /** Additional class names merged onto the tags container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TagInputField = React.forwardRef<HTMLInputElement, TagInputFieldProps>(
  (
    {
      id,
      label,
      error,
      description,
      labelExtra,
      labelClassName,
      wrapperClassName,
      required,
      value,
      onChange,
      onBlur,
      placeholder = "Type and press Enter\u2026",
      disabled,
      maxTags,
      size,
      variant,
      appearance,
      className,
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const tags: string[] = Array.isArray(value) ? value : [];

    const addTag = () => {
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      if (tags.includes(trimmed)) return;
      if (maxTags !== undefined && tags.length >= maxTags) return;
      onChange?.([...tags, trimmed]);
      setInputValue("");
    };

    const removeTag = (index: number) => {
      onChange?.(tags.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag();
      }
      if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    };

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        <TextField
          ref={ref}
          id={id}
          label={label}
          labelExtra={labelExtra}
          labelClassName={labelClassName}
          error={error}
          description={description}
          required={required}
          size={size}
          variant={variant}
          appearance={appearance}
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          render={(inputContent: React.ReactNode) => (
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">{inputContent}</div>
              <Button
                type="button"
                variant={"primary"}
                size={size ?? "sm"}
                onClick={addTag}
                disabled={disabled || !inputValue.trim()}
              >
                Add
              </Button>
            </div>
          )}
        />

        {tags.length > 0 && (
          <div className={cn("flex flex-wrap gap-1.5", className)}>
            {tags.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  disabled={disabled}
                  className="cursor-pointer rounded-full p-0.5 hover:bg-foreground/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  },
);

TagInputField.displayName = "TagInputField";

export { TagInputField };
