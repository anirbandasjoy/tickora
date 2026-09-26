"use client";

import { cva } from "class-variance-authority";
import { Search, SlidersHorizontal } from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../core/button";
import { Input, InputProps } from "../../core/input";
import { Label } from "../../core/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../core/popover";
import { CheckboxField } from "./checkbox-field";
import RenderWrapper, { FieldProps } from "./shared";

// ---------------------------------------------------------------------------
// Style variants with CVA (separate for each element)
// ---------------------------------------------------------------------------

const inputSizeVariants = cva("", {
  variants: {
    size: {
      xs: "pr-9 pl-9",
      sm: "pr-10 pl-10",
      md: "pr-10 pl-10",
      lg: "pr-12 pl-12",
      xl: "pr-14 pl-14",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const iconWrapperSizeVariants = cva("", {
  variants: {
    size: {
      xs: "h-6 w-6",
      sm: "h-7 w-7",
      md: "h-7 w-7",
      lg: "h-8 w-8",
      xl: "h-9 w-9",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const iconSizeVariants = cva("", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-3.5",
      md: "size-3.5",
      lg: "size-4",
      xl: "size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const submitButtonSizeVariants = cva("", {
  variants: {
    size: {
      xs: "xs",
      sm: "sm",
      md: "md",
      lg: "md",
      xl: "lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Base style constants

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
    defaultVariants: {
      size: "md",
    },
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
  defaultVariants: {
    size: "md",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchScope {
  /** Unique value for the scope */
  value: string;
  /** Display label for the scope */
  label: string;
}

export interface SearchScopeConfig {
  /** Available search scopes. */
  options: SearchScope[];
  /** Default selected scope values. */
  default?: string[];
}

interface PopoverOffsets {
  side: number;
  align: number;
}

export interface SearchFieldProps
  extends
    Omit<React.ComponentProps<"div">, "onChange" | "value" | "id">,
    FieldProps {
  scope?: SearchScopeConfig;
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Current input value (controlled). */
  value?: string;
  /** Callback when input value changes. */
  onChange?: (value: string) => void;
  /** Callback when search is triggered (Enter key, search icon, or submit button). */
  onSearch?: (query: string, scopes: string[]) => void;
  /** Submit button text. */
  submitText?: string;
  /** Whether to show the submit button. */
  showSubmitButton?: boolean;
  /** Submit button variant. */
  submitButtonVariant?: React.ComponentProps<typeof Button>["variant"];
  /** Size of the search field. */
  size?: InputProps["size"];
  /** The variant style of the input. */
  variant?: InputProps["variant"];
  /** The appearance style of the input. */
  appearance?: InputProps["appearance"];
  /** Additional class names merged onto the outer wrapper `<div>`. */
  className?: string;
  /** Additional class names merged onto the `<Input>`. */
  inputClassName?: string;
  /** Additional class names for width customization. */
  widthClassName?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Search field with scope selector, input, and submit functionality.
 * Follows the same design pattern as TextField with consistent styling.
 * Supports multiple sizes via CVA variants.
 *
 * @example
 * ```tsx
 * <SearchField
 *   id="userSearch"
 *   label="Search Users"
 *   size="md"
 *   scope={{
 *     options: [
 *       { value: "all", label: "All Fields" },
 *       { value: "name", label: "Name" },
 *       { value: "email", label: "Email" },
 *     ],
 *     default: ["all"],
 *   }}
 *   placeholder="Search by name, email..."
 *   onSearch={(query, scopes) => console.log(query, scopes)}
 *   showSubmitButton
 * />
 * ```
 */
const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      id,
      label,
      scope,
      placeholder = "Search...",
      value,
      onChange,
      onSearch,
      error,
      description,
      submitText = "Search",
      showSubmitButton = false,
      submitButtonVariant = "primary",
      size,
      variant,
      appearance,
      className,
      labelClassName,
      inputClassName,
      widthClassName,
      render,
      ...props
    },
    ref,
  ) => {
    // State for uncontrolled component
    const [internalValue, setInternalValue] = React.useState(value ?? "");
    const [selectedScopes, setSelectedScopes] = React.useState<string[]>(
      scope
        ? (scope.default ?? scope.options.map((option) => option.value))
        : [],
    );
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [popoverWidth, setPopoverWidth] = React.useState<number>();
    const [popoverOffsets, setPopoverOffsets] = React.useState<PopoverOffsets>({
      side: 4,
      align: -8,
    });

    const inputWrapperRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Measure and update popover width and offsets to match input wrapper
    React.useEffect(() => {
      const updateDimensions = () => {
        if (inputWrapperRef.current) {
          const width = inputWrapperRef.current.offsetWidth;
          const height = inputWrapperRef.current.offsetHeight;

          setPopoverWidth(width);

          // Calculate dynamic offsets based on input height
          // sideOffset: ~10% of height for proper spacing
          // alignOffset: negative left padding to align with input start
          setPopoverOffsets({
            side: Math.max(2, Math.round(height * 0.1)),
            align: -8, // Keep consistent or calculate based on padding
          });
        }
      };

      updateDimensions();

      // Update dimensions on window resize
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const inputValue = internalValue;

    const hasError = !!error;
    const hasLabel = !!label;

    // Handle input value change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(newValue);
      // Auto-reset search when the input is fully cleared
      if (newValue === "") {
        onSearch?.("", selectedScopes);
      }
    };

    // Handle search action
    const handleSearch = () => {
      onSearch?.(inputValue, selectedScopes);
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    };

    // Handle scope selection (checkbox behavior - multiple selection)
    const handleScopeChange = (scopeValue: string, checked: boolean) => {
      setSelectedScopes((prev) => {
        if (checked) {
          return prev.includes(scopeValue) ? prev : [...prev, scopeValue];
        }
        return prev.filter((v) => v !== scopeValue);
      });
    };

    // Handle popover search button click
    const handlePopoverSearch = () => {
      setIsPopoverOpen(false);
      handleSearch();
    };

    return (
      <div className={cn("space-y-2", className, widthClassName)} {...props}>
        {/* Label */}
        {hasLabel && (
          <Label
            htmlFor={id}
            size={size}
            variant="field"
            weight="semibold"
            className={labelClassName}
          >
            {label}
          </Label>
        )}

        <RenderWrapper render={render}>
          <div className="flex items-start gap-2">
            {/* Search input with scope selector and search icon */}
            <div
              ref={inputWrapperRef}
              className="group relative w-full min-w-0 flex-1"
            >
              {/* Start adornment - Scope selector */}
              {scope ? (
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      mode={"icon"}
                      type="button"
                      appearance={"ghost"}
                      radius={"full"}
                      className={cn(
                        iconWrapperSizeVariants({ size }),
                        "absolute top-1/2 left-2 z-10 -translate-y-1/2",
                      )}
                    >
                      <SlidersHorizontal
                        className={iconSizeVariants({ size })}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    style={{ width: popoverWidth }}
                    sideOffset={popoverOffsets.side}
                    alignOffset={popoverOffsets.align}
                  >
                    <span className="mb-4 block text-sm font-medium text-muted-foreground">
                      Search scopes
                    </span>
                    <div className="mb-5 space-y-2">
                      {/* Scope checkboxes */}
                      {scope.options.map((option) => {
                        return (
                          <CheckboxField
                            key={`${id}-scope-${option.value}`}
                            id={`${id}-scope-${option.value}`}
                            label={option.label}
                            checked={selectedScopes.includes(option.value)}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                              handleScopeChange(option.value, !!checked);
                            }}
                          />
                        );
                      })}
                    </div>
                    <Button
                      type="button"
                      onClick={handlePopoverSearch}
                      size="xs"
                      className="w-full"
                      variant={"primary"}
                    >
                      Search
                    </Button>
                  </PopoverContent>
                </Popover>
              ) : null}

              {/* Input field */}
              <Input
                ref={ref}
                id={id}
                type="text"
                size={size}
                variant={variant}
                appearance={appearance}
                aria-invalid={hasError}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                  inputSizeVariants({ size }),
                  inputClassName,
                  scope ? "pl-9" : "pl-3",
                )}
              />

              {/* End adornment - Search icon */}
              <Button
                type="button"
                variant={"default"}
                appearance={"ghost"}
                radius={"full"}
                mode={"icon"}
                onClick={handleSearch}
                className={cn(
                  iconWrapperSizeVariants({ size }),
                  "absolute top-1/2 right-2 z-10 -translate-y-1/2",
                )}
              >
                <Search className={iconSizeVariants({ size })} />
              </Button>
            </div>

            {/* Submit button */}
            {showSubmitButton && (
              <Button
                type="button"
                variant={submitButtonVariant}
                onClick={handleSearch}
                size={
                  submitButtonSizeVariants({ size }) as React.ComponentProps<
                    typeof Button
                  >["size"]
                }
              >
                {submitText}
              </Button>
            )}
          </div>
        </RenderWrapper>

        {/* Error message or description */}
        {hasError && <p className={errorTextVariants({ size })}>{error}</p>}
        {!hasError && description && (
          <p className={descriptionTextVariants({ size })}>{description}</p>
        )}
      </div>
    );
  },
);

SearchField.displayName = "SearchField";

export { SearchField };
