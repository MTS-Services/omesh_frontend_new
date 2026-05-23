import { createSlice } from '@reduxjs/toolkit';
import {
  getTrainingStructures,
  addTrainingStructure,
  editTrainingStructure,
  removeTrainingStructure,
  getCompletedEnrollments,
} from './trainingStructureAPI';

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  // Pattern matching: Track individual item actions (loading/error)
  actionLoading: {}, // { [itemId]: string } e.g., { 'id123': 'DELETE' }
  actionError: {}, // { [itemId]: string }
  completedEnrollments: {
    items: [],
    total: 0,
    status: 'idle',
    error: null,
  },
};

// Helpers following your pattern
const extractRoot = (payload) => payload?.data ?? payload ?? {};

const extractList = (payload) => {
  const root = extractRoot(payload);
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.items)) return root.items;
  if (Array.isArray(root?.trainingPlans)) return root.trainingPlans;
  if (Array.isArray(root?.data)) return root.data;
  return [];
};

const extractMeta = (payload) => {
  const root = extractRoot(payload);
  return {
    total: Number(root?.total ?? root?.count ?? extractList(payload).length ?? 0),
    page: Number(root?.page ?? 1),
    limit: Number(root?.limit ?? 10),
  };
};

const getId = (item) => item?.id ?? item?._id ?? item?.eventId;

const trainingStructureSlice = createSlice({
  name: 'trainingStructures',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 1. Fetch Training Structures
      .addCase(getTrainingStructures.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getTrainingStructures.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = extractList(action.payload);
        const meta = extractMeta(action.payload);
        state.total = meta.total;
        state.page = meta.page;
        state.limit = meta.limit;
      })
      .addCase(getTrainingStructures.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      })

      // 2. Add Training Structure
      .addCase(addTrainingStructure.pending, (state) => {
        state.status = 'loading'; // General loading for add
        state.error = null;
      })
      .addCase(addTrainingStructure.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newItem = action.payload?.data ?? action.payload;
        state.items.unshift(newItem);
        state.total += 1;
      })
      .addCase(addTrainingStructure.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // 3. Update (Edit) Training Structure
      .addCase(editTrainingStructure.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.actionLoading[id] = 'EDIT';
        delete state.actionError[id];
      })
      .addCase(editTrainingStructure.fulfilled, (state, action) => {
        const updated = action.payload?.data ?? action.payload;
        const id = getId(updated);
        delete state.actionLoading[id];
        const index = state.items.findIndex((item) => getId(item) === id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(editTrainingStructure.rejected, (state, action) => {
        const id = action.meta.arg.id;
        delete state.actionLoading[id];
        state.actionError[id] = action.payload;
      })

      // 4. Remove Training Structure
      .addCase(removeTrainingStructure.pending, (state, action) => {
        const id = action.meta.arg; // Assuming arg is the ID
        state.actionLoading[id] = 'DELETE';
        delete state.actionError[id];
      })
      .addCase(removeTrainingStructure.fulfilled, (state, action) => {
        const id = action.payload; // ID returned from thunk
        delete state.actionLoading[id];
        state.items = state.items.filter((item) => getId(item) !== id);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(removeTrainingStructure.rejected, (state, action) => {
        const id = action.meta.arg;
        delete state.actionLoading[id];
        state.actionError[id] = action.payload;
      })

      // 5. Completed Enrollments (Nested State Pattern)
      .addCase(getCompletedEnrollments.pending, (state) => {
        state.completedEnrollments.status = 'loading';
      })
      .addCase(getCompletedEnrollments.fulfilled, (state, action) => {
        state.completedEnrollments.status = 'succeeded';
        state.completedEnrollments.items = extractList(action.payload);
        state.completedEnrollments.total = extractMeta(action.payload).total;
      })
      .addCase(getCompletedEnrollments.rejected, (state, action) => {
        state.completedEnrollments.status = 'failed';
        state.completedEnrollments.error = action.payload;
      });
  },
});

export default trainingStructureSlice.reducer;
