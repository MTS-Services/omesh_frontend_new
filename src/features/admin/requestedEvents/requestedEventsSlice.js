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
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
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
  const meta = root?.meta ?? payload?.meta ?? {};
  const items = extractList(payload);

  const total = Number(
    meta?.totalItems ??
      meta?.total ??
      root?.totalItems ??
      root?.total ??
      root?.count ??
      items.length ??
      0
  );
  const limit = Number(meta?.itemsPerPage ?? meta?.limit ?? root?.limit ?? 10);
  const page = Number(meta?.currentPage ?? meta?.page ?? root?.page ?? 1);
  const computedTotalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  return {
    total,
    page,
    limit,
    totalPages: Number(meta?.totalPages ?? root?.totalPages ?? computedTotalPages),
    hasNextPage: Boolean(meta?.hasNextPage ?? root?.hasNextPage),
    hasPreviousPage: Boolean(meta?.hasPreviousPage ?? root?.hasPreviousPage),
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
        state.page = meta.page || Number(action.meta.arg?.page) || 1;
        state.limit = meta.limit || Number(action.meta.arg?.limit) || state.limit || 10;
        state.totalPages = meta.totalPages;
        state.hasNextPage = meta.hasNextPage;
        state.hasPreviousPage = meta.hasPreviousPage;
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
