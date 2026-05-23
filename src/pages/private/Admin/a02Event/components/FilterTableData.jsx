import React from 'react';
import { Search, Calendar, ArrowUpDown, X } from 'lucide-react';

const FilterTableData = ({
  search,
  onSearchChange,
  dateFilter,
  onDateChange,
  sortBy,
  onSortChange,
}) => {
  const isFiltering = search || dateFilter || sortBy;

  const handleClear = () => {
    onSearchChange('');
    onDateChange('');
    onSortChange('');
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-300 focus:outline-none sm:w-44"
        />
      </div>

      {/* Date filter */}
      <div className="relative">
        <Calendar
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-sm text-gray-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
        />
      </div>

      {/* Sort */}
      <div className="relative">
        <ArrowUpDown
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
        />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pr-7 pl-8 text-sm text-gray-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
        >
          <option value="">Sort by</option>
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="date-desc">Date (Newest)</option>
          <option value="title-asc">Title (A–Z)</option>
        </select>
        <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-gray-400">
          ▾
        </span>
      </div>

      {/* Clear */}
      {isFiltering && (
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-100"
        >
          <X size={13} />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterTableData;
