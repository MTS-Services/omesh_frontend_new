import React from 'react';

const ServerPagination = ({ meta = {}, onPageChange }) => {
  const currentPage = Number(meta.currentPage) || 1;
  const totalPages = Math.max(1, Number(meta.totalPages) || 1);
  const itemsPerPage = Number(meta.itemsPerPage) || 10;
  const totalItems = Number(meta.totalItems) || 0;

  const pageStart = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const pageEnd = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrevious = meta.hasPreviousPage ?? currentPage > 1;
  const canGoNext = meta.hasNextPage ?? currentPage < totalPages;

  const handlePrev = () => {
    if (!canGoPrevious) return;
    console.debug('ServerPagination: prev clicked, currentPage=', currentPage);
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    console.debug('ServerPagination: next clicked, currentPage=', currentPage);
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-[#22C55E]">
        Showing {pageStart === 0 ? 0 : pageStart} to {pageEnd} of {totalItems} results
      </p>

      <div className="grid grid-cols-3 items-center gap-2 sm:flex">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={handlePrev}
          className="rounded-xl border border-[#22C55E] px-3 py-1.5 text-sm font-medium text-[#22C55E] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
        >
          Previous
        </button>

        <span className="min-w-20 text-center text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          disabled={!canGoNext}
          onClick={handleNext}
          className="rounded-xl border border-[#22C55E] px-3 py-1.5 text-sm font-medium text-[#22C55E] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ServerPagination;
