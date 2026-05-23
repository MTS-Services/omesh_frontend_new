import { createSlice } from '@reduxjs/toolkit';
import { fetchEvents, fetchEventDetails } from './eventsAPI';

const initialState = {
  items: [],
  details: {},
  selectedItem: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ FETCH EVENTS LIST
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const payload = action.payload;
        if (payload?.items) {
          state.items = payload.items;
          state.meta = payload.meta || { page: 1, limit: 10, total: 0, totalPages: 0 };
        } else {
          state.items = Array.isArray(payload) ? payload : [];
          state.meta = { page: 1, limit: 10, total: state.items.length, totalPages: 1 };
        }
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      })

      // ✅ FETCH EVENT DETAILS
      .addCase(fetchEventDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Store details separately by id
        state.details[action.payload.id] = action.payload;
        // Also update the item in the list if it exists
        const index = state.items.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default eventsSlice.reducer;
