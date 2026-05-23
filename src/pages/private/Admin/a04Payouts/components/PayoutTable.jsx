import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  DollarSign,
  CreditCard,
  CalendarDays,
  Tag,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import Skeleton from '../../../../../components/common/Skeleton';
import { usePayRequests } from '../../../../../features/admin/payRequest/usePayRequests';

const StatusDropdown = ({ status, onStatusChange, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const statusOptions = [
    { label: 'Approved', value: 'APPROVED', color: 'bg-green-100 text-green-700' },
    { label: 'Paid', value: 'PAID', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Pending', value: 'REQUESTED', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Cancel', value: 'REJECTED', color: 'bg-red-100 text-red-700' },
  ];

  const normalizedStatus = String(status || '').toUpperCase();
  const currentStatus = statusOptions.find((opt) => opt.value === normalizedStatus);
  const displayColor = currentStatus?.color || 'bg-gray-100 text-gray-700';
  const displayLabel = currentStatus?.label || normalizedStatus || 'Unknown';

  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 150; // approximate height
      const viewportHeight = window.innerHeight;
      
      // Check if there's space above, otherwise place below
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      
      let top = rect.top - dropdownHeight - 10; // 8px gap
      let left = rect.left;
      
      // If not enough space above, place below
      if (spaceAbove < dropdownHeight + 1 && spaceBelow > spaceAbove) {
        top = rect.bottom + 0;
      }
      
      // Adjust for right edge on mobile
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        left = Math.max(8, Math.min(window.innerWidth - 8, rect.left));
      }
      
      setDropdownPos({ top, left });
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Delay calculation to ensure element is rendered
      const timer = setTimeout(() => calculatePosition(), 0);
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isOpen]);

  const handleSelect = (value) => {
    onStatusChange(value);
    setIsOpen(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target) && 
        buttonRef.current && !buttonRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      <div className="relative inline-block w-full">
        <button
          ref={buttonRef}
          onClick={() => !loading && setIsOpen(!isOpen)}
          disabled={loading}
          className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${displayColor} transition-all disabled:opacity-60`}
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <span>{displayLabel}</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)} 
        />
      )}

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-48 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl"
          style={{
            top: `${dropdownPos.top}px`,
            left: `${Math.max(8, dropdownPos.left)}px`,
            maxWidth: 'calc(100vw - 16px)',
          }}
        >
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                normalizedStatus === option.value
                  ? `${option.color} bg-opacity-20`
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const TableHeaders = () => (
  <thead className="hidden sm:table-header-group">
    <tr className="border-b border-gray-100 bg-gray-50 text-left text-sm text-gray-500">
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <User size={14} />
          Organizer Name
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Mail size={14} />
          Email
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <DollarSign size={14} />
          Amount
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <DollarSign size={14} />
          Method
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <CreditCard size={14} />
          Account Number
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          Date
        </span>
      </th>
      <th className="px-6 py-3 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Tag size={14} />
          Action
        </span>
      </th>
    </tr>
  </thead>
);

const PayoutTable = ({ initialStatus }) => {
  const {
    items,
    total,
    status,
    page,
    totalPages,
    nextPage,
    prevPage,
    updateStatus,
    actionLoading,
    refresh,
  } = usePayRequests(initialStatus);

  console.log('PayoutTable Render:', items);

  const limit = 10;
  const start = (page - 1) * limit;
  const end = Math.min(page * limit, total);

  const onStatusChange = async (requestId, newStatus) => {
    await updateStatus(requestId, newStatus);
    refresh();
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <TableHeaders />
          <tbody className="block sm:table-row-group">
            {status === 'loading' ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hidden sm:table-row">
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-8 w-28 rounded-lg" /></td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              items.map((row) => (
              <tr
                key={row.id}
                className="m-2 block border border-gray-100 bg-white hover:bg-gray-50 sm:m-0 sm:table-row sm:border-0 sm:border-b sm:border-gray-50"
              >
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-800 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <User size={12} />
                    Organizer Name
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <User size={14} className="shrink-0 text-gray-400" />
                    {row.organizer.fullName}
                  </span>
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <Mail size={12} />
                    Email
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} className="shrink-0 text-gray-400" />
                    {row.organizer.email}
                  </span>
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-800 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <DollarSign size={12} />
                    Amount
                  </span>
                  <span className="inline-flex items-center gap-1.5">{row.amount}</span>
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    Method
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {row.method}
                  </span>
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <CreditCard size={12} />
                    Account Number
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CreditCard size={14} className="shrink-0 text-gray-400" />
                     {row.accountNumber}
                  </span>
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-500 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <CalendarDays size={12} />
                    Date
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} className="shrink-0 text-gray-400" />
                    {new Date(row.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="flex items-center justify-between px-4 py-2.5 gap-8 sm:table-cell sm:px-6 sm:py-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 sm:hidden">
                    <Tag size={12} />
                    Action
                  </span>
                  <StatusDropdown
                    status={row.status}
                    onStatusChange={(newStatus) => onStatusChange(row.id, newStatus)}
                    loading={!!actionLoading[row.id]}
                  />
                  {/* <StatusBadge /> */}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-green-600">{start + 1}</span> to{' '}
          <span className="font-medium text-green-600">{end}</span> of {total} results
        </p>
        <div className="flex gap-2">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="rounded-lg border px-4 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="rounded-lg border px-4 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayoutTable;
