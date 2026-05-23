import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEventsList, fetchEventDetails as getEventDetails } from './eventService';
import { handleApiError } from '../../../api/errorHandler';

export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async ({ activeTab = 'all', page = 1 } = {}, { rejectWithValue, signal }) => {
    try {
      return await fetchEventsList({
        page,
        limit: 10,
        status: activeTab === 'all' ? null : activeTab,
        signal,
      });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchEventDetails = createAsyncThunk(
  'events/fetchDetails',
  async (eventId, { rejectWithValue, signal }) => {
    try {
      return await getEventDetails(eventId, { signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
