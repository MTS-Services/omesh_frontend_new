import { memo, useMemo } from 'react';
import { clsx } from 'clsx';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

/**
 * Pagination Component
 *
 * Reusable, accessible pagination following WCAG guidelines.
 *
 * @param {number}   currentPage   - Active page (1-based)
 * @param {number}   totalPages    - Total number of pages
 * @param {function} onPageChange  - Called with the new page number
 * @param {number}   [siblingCount=1] - Pages shown on each side of current
 * @param {string}   [className]   - Extra wrapper classes
 *
 * @example
 * <Pagination
 *   currentPage={page}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 */

const DOTS = '...';

function buildRange(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function usePaginationItems(currentPage, totalPages, siblingCount) {
  return useMemo(() => {
    // Show all pages when total is 5 or less
    if (totalPages <= 5) {
      return buildRange(1, totalPages);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    // Case 1: No left dots, but right dots (near the start)
    if (!showLeftDots && showRightDots) {
      const leftRange = buildRange(1, 3);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 2: Left dots, but no right dots (near the end)
    if (showLeftDots && !showRightDots) {
      const rightRange = buildRange(totalPages - 2, totalPages);
      return [1, DOTS, ...rightRange];
    }

    // Case 3: Both left and right dots (middle pages)
    const middleRange = buildRange(leftSibling, rightSibling);
    return [1, DOTS, ...middleRange, DOTS, totalPages];
  }, [currentPage, totalPages, siblingCount]);
}

const PageButton = memo(({ page, isActive, disabled, onClick, label, children }) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onClick(page)}
      disabled={disabled}
      aria-label={label ?? `Go to page ${page}`}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 focus:ring-2 focus:ring-offset-1 focus:outline-none',
        isActive
          ? 'bg-green-500 text-white shadow-md focus:ring-green-500'
          : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
        disabled && 'pointer-events-none cursor-not-allowed opacity-40'
      )}
    >
      {children ?? page}
    </button>
  );
});

PageButton.displayName = 'PageButton';

const Pagination = memo(
  ({ currentPage, totalPages, onPageChange, siblingCount = 1, className }) => {
    const pages = usePaginationItems(currentPage, totalPages, siblingCount);

    if (totalPages <= 1) return null;

    return (
      <nav
        role="navigation"
        aria-label="Pagination"
        className={clsx('flex items-center gap-2 md:gap-2 flex-wrap justify-center', className)}
      >
        {/* First */}
        <PageButton page={1} disabled={currentPage === 1} onClick={onPageChange} label="First page">
          <ChevronsLeft size={14} className="md:size-4" />
        </PageButton>

        {/* Previous */}
        <PageButton
          page={currentPage - 1}
          disabled={currentPage === 1}
          onClick={onPageChange}
          label="Previous page"
        >
          <ChevronLeft size={14} className="md:size-4" />
        </PageButton>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === DOTS ? (
            <span
              key={`dots-${idx}`}
              className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center text-xs md:text-base font-semibold text-gray-500  select-none"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <PageButton
              key={page}
              page={page}
              isActive={page === currentPage}
              onClick={onPageChange}
            />
          )
        )}

        {/* Next */}
        <PageButton
          page={currentPage + 1}
          disabled={currentPage === totalPages}
          onClick={onPageChange}
          label="Next page"
        >
          <ChevronRight size={14} className="md:size-4" />
        </PageButton>

        {/* Last */}
        <PageButton
          page={totalPages}
          disabled={currentPage === totalPages}
          onClick={onPageChange}
          label="Last page"
        >
          <ChevronsRight size={14} className="md:size-4" />
        </PageButton>
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

export default Pagination;
