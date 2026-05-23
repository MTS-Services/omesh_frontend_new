import { createSlice } from '@reduxjs/toolkit';
import { fetchPayments } from './paymentsAPI';

const initialState = {
  stats: [],
  transactions: [],
  singleValue: {},
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ FETCH PAYMENTS DATA
      .addCase(fetchPayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload.stats || [];
        state.transactions = action.payload.transactions || [];
        state.singleValue = action.payload.singleValue || {};
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default paymentsSlice.reducer;
