import { createSlice } from '@reduxjs/toolkit';
import { getAdminPayRequests, patchPayRequestStatus } from './payRequestActions';

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  actionLoading: {}, // { [requestId]: status }
  actionError: {}, // { [requestId]: string }
};

// Pattern logic matching your requestedEvents
const extractList = (payload) => {
  const root = payload?.data ?? payload;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.items)) return root.items;
  if (Array.isArray(root?.requests)) return root.requests;
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

const payRequestSlice = createSlice({
  name: 'payRequests',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(getAdminPayRequests.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAdminPayRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = extractList(action.payload);
        const meta = extractMeta(action.payload);
        state.total = meta.total;
        state.page = meta.page;
        state.limit = meta.limit;
      })
      .addCase(getAdminPayRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Patch Status
      .addCase(patchPayRequestStatus.pending, (state, action) => {
        const { requestId, status } = action.meta.arg;
        state.actionLoading[requestId] = status; // Kon status e loading hocche seta track rakhe
        delete state.actionError[requestId];
      })
      .addCase(patchPayRequestStatus.fulfilled, (state, action) => {
        const { requestId } = action.payload;
        delete state.actionLoading[requestId];

        // Item-ti list theke remove kore deya (jehetu status REQUESTED theke onno kicho hoye geche)
        state.items = state.items.filter((item) => item.id !== requestId);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(patchPayRequestStatus.rejected, (state, action) => {
        const { requestId } = action.meta.arg;
        delete state.actionLoading[requestId];
        state.actionError[requestId] = action.payload;
      });
  },
});

export const { resetStatus } = payRequestSlice.actions;
export default payRequestSlice.reducer;
