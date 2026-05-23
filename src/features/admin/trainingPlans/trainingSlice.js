import { createSlice } from '@reduxjs/toolkit';
import {
  getTrainingPlans,
  addTrainingPlan,
  editTrainingPlan,
  removeTrainingPlan,
} from './trainingAPI';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const toList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const toItem = (payload) => payload?.data ?? payload?.item ?? payload;

const getId = (item) => item?.id ?? item?._id ?? item?.categoryId;

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(getTrainingPlans.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getTrainingPlans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = toList(action.payload);
      })
      .addCase(getTrainingPlans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add New
      .addCase(addTrainingPlan.pending, (state) => {
        state.error = null;
      })
      .addCase(addTrainingPlan.fulfilled, (state, action) => {
        const item = toItem(action.payload);
        if (item && typeof item === 'object') {
          state.items.push(item);
        }
      })
      .addCase(addTrainingPlan.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Edit
      .addCase(editTrainingPlan.pending, (state) => {
        state.error = null;
      })
      .addCase(editTrainingPlan.fulfilled, (state, action) => {
        const updated = toItem(action.payload);
        const id = getId(updated);
        const index = state.items.findIndex((item) => getId(item) === id);
        if (index !== -1) state.items[index] = updated;
      })
      .addCase(editTrainingPlan.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(removeTrainingPlan.pending, (state) => {
        state.error = null;
      })
      .addCase(removeTrainingPlan.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => getId(item) !== action.payload);
      })
      .addCase(removeTrainingPlan.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default trainingSlice.reducer;
