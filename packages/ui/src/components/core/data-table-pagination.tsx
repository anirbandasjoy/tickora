import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "../../lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface DataTablePaginationProps {
  /**
   * Current page number (1-based)
   */
  page: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Number of items per page
   */
  pageSize: number;

  /**
   * Total number of items
   */
  total: number;

  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;

  /**
   * Callback when page size changes
   */
  onPageSizeChange: (pageSize: number) => void;

  /**
   * Available page size options
   */
  pageSizeOptions?: number[];

  /**
   * Whether to show the "go to first/last" buttons
   */
  showFirstLast?: boolean;

  /**
   * Maximum number of page buttons to show
   */
  maxVisiblePages?: number;

  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * Generates an array of page numbers to display
 */
function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number,
): (number | string)[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  // Always show first page
  pages.push(1);

  // Calculate range around current page
  let start = Math.max(2, currentPage - halfVisible);
  let end = Math.min(totalPages - 1, currentPage + halfVisible);

  // Adjust if we're near the beginning
  if (currentPage <= halfVisible + 1) {
    end = Math.min(totalPages - 1, maxVisible - 1);
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - halfVisible) {
    start = Math.max(2, totalPages - maxVisible + 2);
  }

  // Add ellipsis before middle pages if needed
  if (start > 2) {
    pages.push("...");
  }

  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis after middle pages if needed
  if (end < totalPages - 1) {
    pages.push("...");
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function DataTablePagination({
  page,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  showFirstLast = true,
  maxVisiblePages = 7,
  className,
}: DataTablePaginationProps) {
  const pageNumbers = generatePageNumbers(page, totalPages, maxVisiblePages);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {/* Info Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{startItem}</span> to{" "}
          <span className="font-medium text-foreground">{endItem}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> results
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            Rows per page:
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        {showFirstLast && (
          <Button
            appearance="outline"
            mode="icon"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="hidden sm:inline-flex"
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        <Button
          appearance="outline"
          mode="icon"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="hidden items-center gap-1 sm:flex">
          {pageNumbers.map((pageNum, index) =>
            typeof pageNum === "number" ? (
              <Button
                key={index}
                variant={pageNum === page ? "default" : "secondary"}
                mode="icon"
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "min-w-9",
                  pageNum === page &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-background",
                )}
                aria-label={`Go to page ${pageNum}`}
                aria-current={pageNum === page ? "page" : undefined}
              >
                {pageNum}
              </Button>
            ) : (
              <span
                key={index}
                className="flex h-8 w-9 items-center justify-center text-sm text-muted-foreground select-none"
              >
                {pageNum}
              </span>
            ),
          )}
        </div>

        {/* Mobile Page Indicator */}
        <div className="flex items-center gap-1 px-2 sm:hidden">
          <span className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>
        </div>

        <Button
          appearance="outline"
          mode="icon"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {showFirstLast && (
          <Button
            appearance="outline"
            mode="icon"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="hidden sm:inline-flex"
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
