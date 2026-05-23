import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser } from '../../auth/selectors';
import { fetchEvents, fetchEventDetails } from './eventsAPI';
import {
  selectEvents,
  selectEventsLoading,
  selectEventsError,
  selectEventById,
  selectEventsMeta,
} from './selectors';

export const useEventsList = (activeTab, page = 1) => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const events = useSelector(selectEvents);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);
  const meta = useSelector(selectEventsMeta);
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents({ activeTab, page }));
  }, [dispatch, activeTab, page, signal, user?.id]);

  return { events, loading, error, signal, setSignal, meta };
};

export const useEventDetails = (id) => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const event = useSelector(selectEventById(id));
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);

  const refetch = () => {
    if (id) {
      return dispatch(fetchEventDetails(id));
    }
    return null;
  };

  useEffect(() => {
    if (id) {
      const promise = dispatch(fetchEventDetails(id));
      return () => promise.abort();
    }
  }, [dispatch, id, user?.id]);

  return { event, loading, error, refetch };
};
