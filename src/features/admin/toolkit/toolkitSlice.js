import { createSlice } from '@reduxjs/toolkit';
import { fetchAdminToolkitRequests } from './toolkitAPI';

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  status: 'idle',
  error: null,
};

const extractItems = (payload) => {
  const root = payload?.data ?? payload;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root?.items)) return root.items;
  return [];
};

const extractMeta = (payload) => {
  const root = payload?.data ?? payload;
  const meta = root?.meta ?? payload?.meta ?? {};

  const total = Number(meta?.totalItems ?? root?.total ?? extractItems(payload).length ?? 0);
  const limit = Number(meta?.itemsPerPage ?? root?.limit ?? 10);
  const page = Number(meta?.currentPage ?? root?.page ?? 1);
  const computedTotalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  return {
    total,
    limit,
    page,
    totalPages: Number(meta?.totalPages ?? root?.totalPages ?? computedTotalPages),
    hasNextPage: Boolean(meta?.hasNextPage),
    hasPreviousPage: Boolean(meta?.hasPreviousPage),
  };
};

const toolkitSlice = createSlice({
  name: 'adminToolkit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminToolkitRequests.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminToolkitRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = extractItems(action.payload);

        const meta = extractMeta(action.payload);
        state.total = meta.total;
        state.page = meta.page;
        state.limit = meta.limit;
        state.totalPages = meta.totalPages;
        state.hasNextPage = meta.hasNextPage;
        state.hasPreviousPage = meta.hasPreviousPage;
      })
      .addCase(fetchAdminToolkitRequests.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default toolkitSlice.reducer;
