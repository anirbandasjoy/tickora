import React from "react";

// ---------------------------------------------------------------------------
// Render Wrapper Component
// ---------------------------------------------------------------------------

type Props = {
  render?: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
};

const RenderWrapper = (props: Props) => {
  const { render, children } = props;

  if (render) {
    return render(children);
  }

  return children;
};

// ---------------------------------------------------------------------------
// Common Field Props Type
// ---------------------------------------------------------------------------

/**
 * Base props interface for all form field components.
 * Contains common properties shared across different field types.
 */
export interface FieldProps {
  /** Unique field id — also wires up `<Label htmlFor>`. */
  id: string;
  /** Label text displayed above the field (optional for some fields). */
  label?: string;
  /** Error message string. When present, error styling is applied. */
  error?: string;
  /** Helper / description text shown below the field (hidden when `error` is set). */
  description?: React.ReactNode;
  /** Extra content rendered alongside the label (e.g. a help tooltip, forgot password link). */
  labelExtra?: React.ReactNode;
  /** Additional class names merged onto the `<Label>`. */
  labelClassName?: string;
  /** Additional class names merged onto the outer wrapper `<div>`. */
  wrapperClassName?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Custom render function to wrap the field content. */
  render?: (children: React.ReactNode) => React.ReactNode;
}

export default RenderWrapper;
