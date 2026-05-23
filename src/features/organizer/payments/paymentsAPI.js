import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPaymentsData } from './paymentService';
import { handleApiError } from '../../../api/errorHandler';

export const fetchPayments = createAsyncThunk(
  'payments/fetchData',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await fetchPaymentsData({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().payments;
      return status !== 'succeeded';
    },
  }
);
