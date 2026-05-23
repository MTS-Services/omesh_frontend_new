import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdminRequestedEvents,
  updateAdminEventStatus,
  deleteAdminEvent,
} from './requestedEventsAPI';

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  actionLoading: {}, // { [eventId]: true }
  actionError: {}, // { [eventId]: string }
};

const extractList = (payload) => {
  const root = payload?.data ?? payload;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.items)) return root.items;
  if (Array.isArray(root?.events)) return root.events;
  if (Array.isArray(root?.data)) return root.data;
  return [];
};

const extractMeta = (payload) => {
  const root = payload?.data ?? payload;
  return {
    total: Number(root?.total ?? root?.count ?? extractList(payload).length ?? 0),
    page: Number(root?.page ?? 1),
    limit: Number(root?.limit ?? 10),
  };
};

const requestedEventsSlice = createSlice({
  name: 'adminRequestedEvents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminRequestedEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminRequestedEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = extractList(action.payload);
        const meta = extractMeta(action.payload);
        state.total = meta.total;
        state.page = meta.page;
        state.limit = meta.limit;
      })
      .addCase(fetchAdminRequestedEvents.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      })

      // update status
      .addCase(updateAdminEventStatus.pending, (state, action) => {
        const { eventId, status } = action.meta.arg;
        state.actionLoading[eventId] = status; // 'APPROVED' | 'SUSPENDED'
        delete state.actionError[eventId];
      })
      .addCase(updateAdminEventStatus.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        delete state.actionLoading[eventId];
        state.items = state.items.filter((item) => (item?.id ?? item?.eventId) !== eventId);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(updateAdminEventStatus.rejected, (state, action) => {
        const id = action.meta.arg.eventId;
        delete state.actionLoading[id];
        state.actionError[id] = action.payload;
      })

      // delete event
      .addCase(deleteAdminEvent.pending, (state, action) => {
        const eventId = action.meta.arg;
        state.actionLoading[eventId] = 'DELETE';
        delete state.actionError[eventId];
      })
      .addCase(deleteAdminEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        delete state.actionLoading[eventId];
        state.items = state.items.filter((item) => (item?.id ?? item?.eventId) !== eventId);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteAdminEvent.rejected, (state, action) => {
        const eventId = action.meta.arg;
        delete state.actionLoading[eventId];
        state.actionError[eventId] = action.payload;
      });
  },
});

export default requestedEventsSlice.reducer;
