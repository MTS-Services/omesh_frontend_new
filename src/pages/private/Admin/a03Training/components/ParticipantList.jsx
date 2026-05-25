import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Skeleton from '../../../../../components/common/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { getCompletedEnrollments } from '../../../../../features/admin/trainingPlans/trainingStructureAPI';
import { exportEnrollments } from '../../../../../features/admin/trainingPlans/trainingStructureService';
import { toast } from 'react-toastify';

const downloadFile = (blob, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

const ParticipantList = () => {
  const dispatch = useDispatch();
  const [isExporting, setIsExporting] = useState(false);
  // 1. Local State for Pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [showLoading, setShowLoading] = useState();

  const { items, status, total, error } = useSelector(
    (state) => state.trainingStructures.completedEnrollments
  );

  // 2. Trigger fetch when page changes
  useEffect(() => {
    dispatch(getCompletedEnrollments({ page, limit }));
  }, [dispatch, page]);

  // 3. Derived Pagination Calculations
  const totalPages = Math.ceil((total || 0) / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total || 0);

  const handleExport = async (format) => {
    setShowLoading(format);
    try {
      setIsExporting(true);
      const response = await exportEnrollments(format);

      // The 'response' from your request utility usually contains the blob
      const fileName = `participants_export_${new Date().getTime()}.${format}`;
      downloadFile(response, fileName);

      toast.success(`${format.toUpperCase()} exported successfully!`);
    } catch (error) {
      console.error('Export failed', error);
      toast.error('Failed to export file');
    } finally {
      setIsExporting(false);
    }
  };

  if (status === 'failed')
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
        <h3 className="text-base font-bold text-gray-900">Participant List</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            {showLoading === 'csv' && isExporting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Download size={14} />
            )}
            <span>{showLoading === 'csv' && isExporting ? 'Exporting...' : 'Download CSV'}</span>
          </button>
          <button
            onClick={() => handleExport('xlsx')}
            className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            {showLoading === 'xlsx' && isExporting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Download size={14} />
            )}
            <span>{showLoading === 'xlsx' && isExporting ? 'Exporting...' : 'Download Execl'}</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-gray-500">
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Plan</th>
              <th className="px-6 py-3 font-medium">Join Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            {status === 'loading' ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="hidden sm:table-row">
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Participant List data not found
                </td>
              </tr>
            ) : (
              items.map((p) => (
              <tr
                key={p.id}
                className="m-2 block border border-gray-100 bg-white hover:bg-gray-50 sm:m-0 sm:table-row sm:border-0 sm:border-b sm:border-gray-50"
              >
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-800 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="text-xs font-medium text-gray-400 sm:hidden">User</span>
                  {p.user?.fullName || 'Unknown User'}
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="text-xs font-medium text-gray-400 sm:hidden">Plan</span>
                  {p?.plan?.category?.plan || 'N/A'}
                </td>
                <td className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-4">
                  <span className="text-xs font-medium text-gray-400 sm:hidden">Join Date</span>
                  {new Date(p.startedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="flex items-center justify-between px-4 py-2.5 sm:table-cell sm:px-6 sm:py-4">
                  <span className="text-xs font-medium text-gray-400 sm:hidden">Status</span>
                  <StatusBadge status={p.status} />
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-green-600">{start}</span> to{' '}
          <span className="font-semibold text-green-600">{end}</span> of{' '}
          <span className="font-semibold text-green-600">{total || 0}</span> results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantList;
