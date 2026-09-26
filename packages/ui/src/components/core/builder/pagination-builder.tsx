"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button, ButtonProps } from "../button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "../pagination";

// ============================================
// Pagination Builder Types
// ============================================

/**
 * Complete pagination builder data structure
 */
export interface PaginationData {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Whether to show the "go to first/last" buttons. Defaults to true */
  showFirstLast?: boolean;
  /** Maximum number of page buttons to show. Defaults to 7 */
  maxVisiblePages?: number;
}

// ============================================
// Component Props
// ============================================

export type PaginationBuilderProps = React.ComponentProps<typeof Pagination> & {
  /** Pagination data containing page state and configuration */
  data: PaginationData;
  /** Optional class name for pagination content */
  contentClassName?: string;
  /** Optional class name for pagination items */
  itemClassName?: string;
};

// ============================================
// Helper Functions
// ============================================

/**
 * Generates an array of page numbers to display with ellipsis handling
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of page buttons to show
 * @returns Array of page numbers or ellipsis strings
 */
function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number,
): (number | string)[] {
  // If total pages fit within max visible, show all
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

  // Always show last page (if different from first)
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

// ============================================
// Pagination Builder Component
// ============================================

/**
 * PaginationBuilder - A flexible pagination component builder
 *
 * Automatically renders pagination controls from data,
 * handling page navigation, ellipsis for large page counts,
 * and accessibility attributes.
 *
 * @example
 * ```tsx
 * const data = {
 *   currentPage: 1,
 *   totalPages: 10,
 *   onPageChange: (page) => setCurrentPage(page),
 *   showFirstLast: true,
 *   maxVisiblePages: 7,
 * };
 * <PaginationBuilder data={data} />
 * ```
 */
export function PaginationBuilder({
  data,
  contentClassName,
  itemClassName,
  className,
  ...props
}: PaginationBuilderProps) {
  const {
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    maxVisiblePages = 5,
  } = data;

  const pageNumbers = generatePageNumbers(
    currentPage,
    totalPages,
    maxVisiblePages,
  );

  const iconSize: ButtonProps["size"] = "xs";

  return (
    <Pagination className={className} {...props}>
      <PaginationContent className={contentClassName}>
        {/* First Page Button */}
        {showFirstLast && (
          <PaginationItem className={itemClassName}>
            <Button
              size={iconSize}
              mode={"icon"}
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>
        )}

        {/* Previous Page Button */}
        <PaginationItem className={itemClassName}>
          <Button
            size={iconSize}
            mode={"icon"}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>

        {/* Page Numbers with Ellipsis */}
        {pageNumbers.map((pageNum, index) => {
          // Handle ellipsis
          if (typeof pageNum === "string") {
            return (
              <PaginationItem
                key={`ellipsis-${index}`}
                className={itemClassName}
              >
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Handle page number button
          const isActive = pageNum === currentPage;

          return (
            <PaginationItem key={pageNum} className={itemClassName}>
              <Button
                variant={isActive ? "primary" : "default"}
                size={iconSize}
                mode={"icon"}
                onClick={() => onPageChange(pageNum)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
                className={cn("min-w-8")}
              >
                {pageNum}
              </Button>
            </PaginationItem>
          );
        })}

        {/* Next Page Button */}
        <PaginationItem className={itemClassName}>
          <Button
            size={iconSize}
            mode={"icon"}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>

        {/* Last Page Button */}
        {showFirstLast && (
          <PaginationItem className={itemClassName}>
            <Button
              size={iconSize}
              mode={"icon"}
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
