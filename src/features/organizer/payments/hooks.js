import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments } from './paymentsAPI';
import {
  selectPaymentStats,
  selectPaymentTransactions,
  selectPaymentsLoading,
  selectPaymentsError,
  selectAmountData,
} from './selectors';

export const usePaymentsData = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectPaymentStats);
  const transactions = useSelector(selectPaymentTransactions);
  const statesAmount = useSelector(selectAmountData);
  const loading = useSelector(selectPaymentsLoading);
  const error = useSelector(selectPaymentsError);
  const [signal, setSignal] = useState(null);

  // const refresh = useCallback(() => {
  //   dispatch(fetchPayments());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPayments());
    console.log('Fetching payments data with signal:', signal);
  }, [dispatch, signal]);

  return { stats, transactions, statesAmount, loading, error, signal, setSignal };
};
