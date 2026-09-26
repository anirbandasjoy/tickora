import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import React, { type ReactNode } from "react";
import { Alert, AlertDescription } from "../alert";
import { TableCell, TableRow } from "../table";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type ContainerWrapper = (children: ReactNode) => ReactNode;
type Variant = "table" | "normal";
type VariantConfig = {
  colSpan?: number;
};

/**
 * Props for StateBuilder component.
 *
 * @template T - The type of data being rendered
 */
interface StateBuilderProps<T> {
  /** Loading state flag */
  isLoading: boolean;
  /** Error state flag */
  isError: boolean;
  /** Success state flag */
  isSuccess: boolean;
  /** Empty state flag */
  isEmpty: boolean;
  /** The data to render on success */
  data: T | undefined;
  /** Custom error message (default: "Something went wrong. Please try again.") */
  errorMessage?: ReactNode;
  /** Custom loading message (default: "Loading...") */
  loadingMessage?: ReactNode;
  /** Custom empty message (default: "No data available.") */
  emptyMessage?: ReactNode;
  /** Custom error component to render */
  errorComponent?: ReactNode;
  /** Custom loading component to render */
  loadingComponent?: ReactNode;
  /** Custom empty component to render */
  emptyComponent?: ReactNode;
  /** Custom wrapper for error state */
  errorContainer?: ContainerWrapper;
  /** Custom wrapper for loading state */
  loadingContainer?: ContainerWrapper;
  /** Custom wrapper for empty state */
  emptyContainer?: ContainerWrapper;
  /** Rendering variant — 'table' wraps non-row states in a TableRow/TableCell */
  variant?: Variant;
  /** Config for the active variant */
  variantConfig?: VariantConfig;
  /** Number of loading skeletons (only used with loadingComponent) */
  loadersCount?: number;
  /** Render function for successful data state */
  render: (data: T) => ReactNode;
}

/**
 * Wraps content based user-defined container.
 *
 * @param content - The content to wrap
 * @param container - Optional custom container wrapper
 * @returns Wrapped content
 */
const wrapContainer = (
  content: ReactNode,
  container?: ContainerWrapper,
): ReactNode => {
  if (container) {
    return container(content);
  }

  return content;
};

/**
 * Wraps item based on variant and user-defined container.
 *
 * @param content - The content to wrap
 * @param container - Optional custom container wrapper
 * @returns Wrapped content
 */
const wrapVariant = (
  variant: Variant,
  content: ReactNode,
  config?: VariantConfig,
): ReactNode => {
  const cells = Array.isArray(content) ? content : [content];
  const colSpan =
    cells.length > 1 ? (config?.colSpan ?? cells.length) / cells.length : 100;

  if (variant === "table") {
    return (
      <TableRow className="hover:bg-transparent">
        {cells.map((cellContent, index) => {
          return (
            <TableCell key={index} colSpan={colSpan}>
              {cellContent}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  return content;
};

/**
 * StateBuilder component for handling loading, error, empty, and success states.
 *
 * This component wraps your content and automatically renders the appropriate
 * UI based on the state flags provided. It supports custom components and
 * container wrappers for each state.
 *
 * @template T - The type of data to render
 */
const StateBuilder = <T,>(props: StateBuilderProps<T>) => {
  const {
    isLoading,
    isError,
    isSuccess,
    isEmpty,
    data,
    errorMessage = "Something went wrong. Please try again.",
    loadingMessage = "Loading...",
    emptyMessage = "No data available.",
    errorComponent,
    loadingComponent,
    emptyComponent,
    errorContainer,
    loadingContainer,
    emptyContainer,
    variant = "normal",
    variantConfig,
    loadersCount = 1,
    render,
  } = props;

  // Error state
  if (!isLoading && isError) {
    const content = wrapVariant(
      variant,
      errorComponent ?? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ),
      variantConfig,
    );

    return wrapContainer(content, errorContainer);
  }

  // Empty state
  if (!isLoading && isEmpty) {
    const content = wrapVariant(
      variant,
      emptyComponent ?? (
        <Alert>
          <Inbox className="h-4 w-4" />
          <AlertDescription>{emptyMessage}</AlertDescription>
        </Alert>
      ),
      variantConfig,
    );
    return wrapContainer(content, emptyContainer);
  }

  // Success state
  if (!isLoading && isSuccess && data !== undefined) {
    return render(data);
  }

  // Loading state — custom loadingComponent is already a valid row, no wrapping needed
  if (loadingComponent) {
    const loaders = Array.from({ length: loadersCount }, (_, index) => (
      <React.Fragment key={index}>
        {wrapVariant(variant, loadingComponent, variantConfig)}
      </React.Fragment>
    ));

    return wrapContainer(loaders, loadingContainer);
  }

  // Default loading content
  const defaultLoadingContent = wrapVariant(
    variant,
    <Alert>
      <Loader2 className="h-4 w-4 animate-spin" />
      <AlertDescription>{loadingMessage}</AlertDescription>
    </Alert>,
    variantConfig,
  );

  return wrapContainer(defaultLoadingContent, loadingContainer);
};

export default StateBuilder;
