import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicEventsListAPI, fetchPublicEventDetailsAPI } from './eventsAPI';
import { isValidEventId } from './eventMapper';
import {
  selectPublicEvents,
  selectPublicEventsStatus,
  selectPublicEventsLoading,
  selectPublicEventsError,
  selectPublicEventById,
} from './selectors';

export const usePublicEventsList = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectPublicEvents);
  const status = useSelector(selectPublicEventsStatus);
  const loading = useSelector(selectPublicEventsLoading);
  const error = useSelector(selectPublicEventsError);

  useEffect(() => {
    const promise = dispatch(fetchPublicEventsListAPI());
    return () => promise.abort();
  }, [dispatch]);

  return { events, status, loading, error };
};

export const usePublicEventDetails = (id) => {
  const dispatch = useDispatch();
  const validId = isValidEventId(id);
  const event = useSelector(selectPublicEventById(id));
  const loadingState = useSelector(selectPublicEventsLoading);
  const errorState = useSelector(selectPublicEventsError);
  const [hasRequestedDetails, setHasRequestedDetails] = useState(false);
  const loading = validId ? loadingState || (!event && !hasRequestedDetails) : false;
  const error = validId ? errorState : null;

  useEffect(() => {
    if (!validId) return;
    setHasRequestedDetails(true);
    const promise = dispatch(fetchPublicEventDetailsAPI(id));
    return () => promise.abort();
  }, [dispatch, id, validId]);

  return { event, loading, error, isValidId: validId };
};
