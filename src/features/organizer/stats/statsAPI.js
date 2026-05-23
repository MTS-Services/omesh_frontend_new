import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleApiError } from '../../../api/errorHandler';
import {
  fetchOrganizerStatsService,
  fetchOrganizerSalesCountService,
  fetchOrganizerTopEventService,
} from './statsService';

const normalizeRange = (range) => {
  const value = String(range || 'week').toLowerCase();
  if (['week', 'month', 'year'].includes(value)) return value;
  return 'week';
};

export const fetchOrganizerStats = createAsyncThunk(
  'organizerStats/fetchStats',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await fetchOrganizerStatsService({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().organizerStats;
      return status !== 'succeeded';
    },
  }
);

export const fetchOrganizerSalesCount = createAsyncThunk(
  'organizerStats/fetchSalesCount',
  async (range, { rejectWithValue, signal }) => {
    try {
      const normalizedRange = normalizeRange(range);
      const response = await fetchOrganizerSalesCountService(normalizedRange, { signal });
      return { range: normalizedRange, response };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
  {
    condition: (range, { getState }) => {
      const normalizedRange = normalizeRange(range);
      const { salesStatusByRange } = getState().organizerStats;
      return salesStatusByRange[normalizedRange] !== 'succeeded';
    },
  }
);

export const fetchOrganizerTopEvent = createAsyncThunk(
  'organizerStats/fetchTopEvent',
  async (range, { rejectWithValue, signal }) => {
    try {
      const normalizedRange = normalizeRange(range);
      const response = await fetchOrganizerTopEventService(normalizedRange, { signal });
      return { range: normalizedRange, response };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
  {
    condition: (range, { getState }) => {
      const normalizedRange = normalizeRange(range);
      const { topEventStatusByRange } = getState().organizerStats;
      return topEventStatusByRange[normalizedRange] !== 'succeeded';
    },
  }
);
