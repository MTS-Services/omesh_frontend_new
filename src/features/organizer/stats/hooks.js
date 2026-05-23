import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganizerSalesCount, fetchOrganizerStats, fetchOrganizerTopEvent } from './statsAPI';
import {
  selectOrganizerStats,
  selectOrganizerStatsLoading,
  selectOrganizerStatsError,
  selectOrganizerSalesByRange,
  selectOrganizerSalesLoadingByRange,
  selectOrganizerSalesErrorByRange,
  selectOrganizerTopEventByRange,
  selectOrganizerTopEventLoadingByRange,
  selectOrganizerTopEventErrorByRange,
} from './selectors';

export const useOrganizerStats = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectOrganizerStats);
  const loading = useSelector(selectOrganizerStatsLoading);
  const error = useSelector(selectOrganizerStatsError);

  useEffect(() => {
    const promise = dispatch(fetchOrganizerStats());
    return () => promise.abort();
  }, [dispatch]);

  return { stats, loading, error };
};

export const useOrganizerSalesCount = (range) => {
  const dispatch = useDispatch();
  const salesData = useSelector((state) => selectOrganizerSalesByRange(state, range));
  const loading = useSelector((state) => selectOrganizerSalesLoadingByRange(state, range));
  const error = useSelector((state) => selectOrganizerSalesErrorByRange(state, range));

  useEffect(() => {
    const promise = dispatch(fetchOrganizerSalesCount(range));
    return () => promise.abort();
  }, [dispatch, range]);

  return { salesData, loading, error };
};

export const useOrganizerTopEvent = (range) => {
  const dispatch = useDispatch();
  const topEventData = useSelector((state) => selectOrganizerTopEventByRange(state, range));
  const loading = useSelector((state) => selectOrganizerTopEventLoadingByRange(state, range));
  const error = useSelector((state) => selectOrganizerTopEventErrorByRange(state, range));

  useEffect(() => {
    const promise = dispatch(fetchOrganizerTopEvent(range));
    return () => promise.abort();
  }, [dispatch, range]);

  return { topEventData, loading, error };
};
