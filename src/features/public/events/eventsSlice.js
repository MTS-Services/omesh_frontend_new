import { createSlice } from '@reduxjs/toolkit';
import { fetchPublicEventDetailsAPI, fetchPublicEventsListAPI } from './eventsAPI';

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const publicEventsSlice = createSlice({
  name: 'publicEvents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicEventsListAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicEventsListAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = Array.isArray(action.payload) ? action.payload.filter(Boolean) : [];
      })
      .addCase(fetchPublicEventsListAPI.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      })
      // EVENT DETAILS
      .addCase(fetchPublicEventDetailsAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicEventDetailsAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (!action.payload) return;
        const index = state.items.findIndex((e) => e?.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchPublicEventDetailsAPI.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default publicEventsSlice.reducer;
