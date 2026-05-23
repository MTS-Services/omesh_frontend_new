import { createSlice } from '@reduxjs/toolkit';
import { fetchTrainingPlansByCategoryAPI, fetchTrainingPlanByIdAPI } from './trainingPlansAPI';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  category: null,
  pagination: null,
  selectedPlan: null,
  selectedPlanStatus: 'idle',
  selectedPlanError: null,
};

const slice = createSlice({
  name: 'publicTrainingPlans',
  initialState,
  reducers: {
    clearSelectedPlan(state) {
      state.selectedPlan = null;
      state.selectedPlanStatus = 'idle';
      state.selectedPlanError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── List by category ──────────────────────────────────────────
      .addCase(fetchTrainingPlansByCategoryAPI.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.category = action.meta.arg?.category ?? state.category;
      })
      .addCase(fetchTrainingPlansByCategoryAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload?.items ?? [];
        state.pagination = action.payload?.pagination ?? null;
      })
      .addCase(fetchTrainingPlansByCategoryAPI.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      })

      // ── Single plan by ID ─────────────────────────────────────────
      .addCase(fetchTrainingPlanByIdAPI.pending, (state) => {
        state.selectedPlanStatus = 'loading';
        state.selectedPlanError = null;
      })
      .addCase(fetchTrainingPlanByIdAPI.fulfilled, (state, action) => {
        state.selectedPlanStatus = 'succeeded';
        state.selectedPlan = action.payload;
      })
      .addCase(fetchTrainingPlanByIdAPI.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.selectedPlanStatus = 'idle';
          return;
        }
        state.selectedPlanStatus = 'failed';
        state.selectedPlanError = action.payload;
      });
  },
});

export const { clearSelectedPlan } = slice.actions;
export default slice.reducer;
