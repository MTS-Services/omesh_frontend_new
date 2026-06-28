import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../api/config/constants';

export const useUsers = (initialRole = 'ORGANIZER') => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [actionLoading, setActionLoading] = useState({});

  const limit = 10;

  const fetchUsers = useCallback(
    async (pageNumber = 1) => {
      setStatus('loading');
      try {
        const { data: res } = await axios.get(`${API_CONFIG.BASE_URL}/api/v1/dashboard/users`, {
          params: { page: pageNumber, limit, role: initialRole },
        });

        setItems(res.data || []);
        setTotal(res.meta?.totalItems || 0);
        setTotalPages(res.meta?.totalPages || 1);
        setPage(res.meta?.currentPage || pageNumber);
        setStatus('success');
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setStatus('error');
      }
    },
    [initialRole]
  );

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const nextPage = () => page < totalPages && fetchUsers(page + 1);
  const prevPage = () => page > 1 && fetchUsers(page - 1);
  const refresh = () => fetchUsers(page);

  const deleteUser = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.delete(`${API_CONFIG.BASE_URL}/api/v1/users/${userId}`);
      refresh();
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return {
    items,
    total,
    page,
    totalPages,
    status,
    actionLoading,
    nextPage,
    prevPage,
    refresh,
    deleteUser,
  };
};
