import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUsers } from './usersAPI';
import { selectUsers, selectLoading, selectError } from './selectors';

export const useUsers = () => {
  const dispatch = useDispatch();

  const users = useSelector(selectUsers);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    const promise = dispatch(fetchUsers());

    return () => promise.abort();
  }, [dispatch]);

  return { users, loading, error };
};
