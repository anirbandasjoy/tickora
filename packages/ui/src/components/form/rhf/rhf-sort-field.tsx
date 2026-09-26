"use client";

import {
  SortField,
  type SortFieldProps,
  type SortOption,
  type SortOrder,
} from "../fields/sort-field";
import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFSortFieldProps<
  T extends FieldValues = FieldValues,
> extends Omit<SortFieldProps, "id" | "sortBy" | "sortOrder" | "error"> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path for sortBy. */
  sortByName: FieldPath<T>;
  /** Field name path for sortOrder. */
  sortOrderName: FieldPath<T>;
  /** Options to display in the sort dropdown. */
  options: SortOption[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form wrapper around `SortField`.
 * Manages two form fields (sortBy and sortOrder) with a single select.
 *
 * @example
 * ```tsx
 * <RHFSortField
 *   control={control}
 *   sortByName="sortBy"
 *   sortOrderName="sortOrder"
 *   options={[
 *     { sortBy: "createdAt", sortOrder: "desc", label: "Created (Newest First)" },
 *     { sortBy: "createdAt", sortOrder: "asc", label: "Created (Oldest First)" },
 *     { sortBy: "name", sortOrder: "asc", label: "Name (A to Z)" },
 *   ]}
 * />
 * ```
 */
function RHFSortFieldInner<T extends FieldValues = FieldValues>(
  {
    control,
    sortByName,
    sortOrderName,
    options,
    onSortChange,
    ...rest
  }: RHFSortFieldProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    field: sortByField,
    fieldState: { error: sortByError },
  } = useController({ control, name: sortByName });

  const { field: sortOrderField } = useController({
    control,
    name: sortOrderName,
  });

  const handleSortChange = (sortBy: string, sortOrder: SortOrder) => {
    sortByField.onChange(sortBy);
    sortOrderField.onChange(sortOrder);
    onSortChange?.(sortBy, sortOrder);
  };

  return (
    <SortField
      ref={ref}
      id={`${sortByName}-${sortOrderName}`}
      sortBy={sortByField.value}
      sortOrder={sortOrderField.value}
      onSortChange={handleSortChange}
      options={options}
      error={sortByError?.message}
      {...rest}
    />
  );
}

const RHFSortField = React.forwardRef(RHFSortFieldInner) as <
  T extends FieldValues = FieldValues,
>(
  props: RHFSortFieldProps<T> & React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement;

export { RHFSortField };
