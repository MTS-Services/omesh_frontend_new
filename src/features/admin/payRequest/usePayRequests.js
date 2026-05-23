import { useEffect, useState, useCallback } from 'react';
import { fetchAdminPayRequests, updatePayRequestStatus } from './payRequestAPI';
import { getNormalizedError } from '../../../api/errorHandler';

export const usePayRequests = (initialStatus) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});

  const limit = 10;

  const fetchRequests = useCallback(() => {
    const query = {
      page,
      limit,
      ...(statusFilter ? { status: statusFilter } : {}),
    };

    setStatus('loading');
    setError(null);

    fetchAdminPayRequests(query)
      .then((payload) => {
        const list = Array.isArray(payload?.data) ? payload.data : [];
        const meta = payload?.meta ?? {};

        setItems(list);
        setTotal(Number(meta?.totalItems ?? list.length ?? 0));
        setStatus('succeeded');
      })
      .catch((err) => {
        const normalized = getNormalizedError(err);
        setStatus('failed');
        setError(normalized?.message || 'Failed to fetch payout requests');
      });
  }, [statusFilter, page, limit]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Handle Approve/Reject
  const updateStatus = async (requestId, newStatus) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: newStatus }));
    setActionError((prev) => {
      const next = { ...prev };
      delete next[requestId];
      return next;
    });

    try {
      await updatePayRequestStatus({ requestId, status: newStatus });

      if (statusFilter) {
        setItems((prev) => prev.filter((item) => item.id !== requestId));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === requestId ? { ...item, status: newStatus } : item))
        );
      }

      return { requestId, status: newStatus };
    } catch (err) {
      const normalized = getNormalizedError(err);
      setActionError((prev) => ({
        ...prev,
        [requestId]: normalized?.message || 'Update failed',
      }));
      throw err;
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });
    }
  };

  // Pagination helpers
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  return {
    // State
    items,
    total,
    status,
    error,
    actionLoading,
    actionError,
    page,
    totalPages,

    // Actions
    setPage,
    setStatusFilter,
    updateStatus,
    refresh: fetchRequests,
    nextPage,
    prevPage,
  };
};
