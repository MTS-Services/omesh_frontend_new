import { createSlice } from '@reduxjs/toolkit';
import { fetchTrainingCategoriesAPI } from './trainingAPI';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const publicTrainingSlice = createSlice({
  name: 'publicTraining',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainingCategoriesAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTrainingCategoriesAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTrainingCategoriesAPI.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default publicTrainingSlice.reducer;
