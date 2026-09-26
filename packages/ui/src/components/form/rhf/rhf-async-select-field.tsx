"use client";

import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  AsyncSelectField,
  type AsyncSelectFieldProps,
  type AsyncSelectOption,
} from "../fields/async-select-field";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RHFAsyncSelectFieldProps<
  T extends FieldValues = FieldValues,
  TValue = string,
> extends Omit<
  AsyncSelectFieldProps<TValue>,
  "id" | "value" | "onChange" | "error"
> {
  /** The `control` object from `useForm()`. */
  control: Control<T>;
  /** Field name path (type-safe when `T` is provided). */
  name: FieldPath<T>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * React Hook Form `Controller`-based wrapper around `AsyncSelectField`.
 *
 * The caller is still responsible for fetching options and managing
 * `searchValue` / `onSearchChange` — this wrapper only handles wiring
 * the RHF value/onChange/error into the field.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState("");
 * const { data, isFetching } = useGetUsersQuery({ searchTerm: search });
 *
 * <RHFAsyncSelectField
 *   control={control}
 *   name="userId"
 *   label="Assigned To"
 *   options={data?.results ?? []}
 *   isLoading={isFetching}
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   renderItem={(option) => (
 *     <span className="flex items-center gap-2">
 *       <Avatar src={option.avatar} />
 *       {option.label}
 *     </span>
 *   )}
 * />
 * ```
 */
function RHFAsyncSelectFieldInner<
  T extends FieldValues = FieldValues,
  TValue = string,
>(
  { control, name, ...rest }: RHFAsyncSelectFieldProps<T, TValue>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <AsyncSelectField<TValue>
      ref={ref}
      id={name}
      value={value as TValue | undefined}
      onChange={onChange}
      error={error?.message}
      {...rest}
    />
  );
}

const RHFAsyncSelectField = React.forwardRef(RHFAsyncSelectFieldInner) as <
  T extends FieldValues = FieldValues,
  TValue = string,
>(
  props: RHFAsyncSelectFieldProps<T, TValue> &
    React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement;

export { RHFAsyncSelectField };
export type { AsyncSelectOption };
