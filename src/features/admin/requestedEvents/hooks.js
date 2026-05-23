import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminRequestedEvents,
  updateAdminEventStatus,
  deleteAdminEvent,
} from './requestedEventsAPI';
import {
  selectAdminRequestedEvents,
  selectAdminRequestedEventsError,
  selectAdminRequestedEventsLimit,
  selectAdminRequestedEventsLoading,
  selectAdminRequestedEventsPage,
  selectAdminRequestedEventsTotal,
  selectAdminEventActionLoading,
  selectAdminEventActionError,
} from './selectors';

export const useAdminRequestedEvents = (query) => {
  const dispatch = useDispatch();
  const events = useSelector(selectAdminRequestedEvents);
  const total = useSelector(selectAdminRequestedEventsTotal);
  const currentPage = useSelector(selectAdminRequestedEventsPage);
  const currentLimit = useSelector(selectAdminRequestedEventsLimit);
  const loading = useSelector(selectAdminRequestedEventsLoading);
  const error = useSelector(selectAdminRequestedEventsError);
  const actionLoading = useSelector(selectAdminEventActionLoading);
  const actionError = useSelector(selectAdminEventActionError);

  useEffect(() => {
    const promise = dispatch(fetchAdminRequestedEvents(query));
    return () => promise.abort();
  }, [dispatch, query]);

  const approveEvent = (eventId) =>
    dispatch(updateAdminEventStatus({ eventId, status: 'APPROVED' }));

  const rejectEvent = (eventId) =>
    dispatch(updateAdminEventStatus({ eventId, status: 'SUSPENDED' }));

  const deleteEvent = (eventId) => dispatch(deleteAdminEvent(eventId));

  return {
    events,
    total,
    currentPage,
    currentLimit,
    loading,
    error,
    actionLoading,
    actionError,
    approveEvent,
    rejectEvent,
    deleteEvent,
  };
};
