import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, fetchDashboardSalesCount } from './dashboardAPI';
import {
  selectDashboardStats,
  selectDashboardLoading,
  selectDashboardError,
  selectDashboardSalesCount,
  selectDashboardSalesLoading,
  selectDashboardSalesError,
} from './selectors';

export const useAdminDashboard = (range = 'month') => {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);
  const salesCount = useSelector(selectDashboardSalesCount);
  const salesLoading = useSelector(selectDashboardSalesLoading);
  const salesError = useSelector(selectDashboardSalesError);

  useEffect(() => {
    const promise = dispatch(fetchDashboardStats());
    return () => promise.abort();
  }, [dispatch]);

  useEffect(() => {
    const promise = dispatch(fetchDashboardSalesCount(range));
    return () => promise.abort();
  }, [dispatch, range]);

  return { stats, loading, error, salesCount, salesLoading, salesError };
};
