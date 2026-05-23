import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleApiError } from '../../../api/errorHandler';
import { fetchEventDetailsServices, fetchEventsListServices } from './eventService';
import { isValidEventId } from './eventMapper';

export const fetchPublicEventsListAPI = createAsyncThunk(
  'publicEvents/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await fetchEventsListServices({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ✅ New thunk for fetching event details
export const fetchPublicEventDetailsAPI = createAsyncThunk(
  'publicEvents/fetchDetails',
  async (eventId, { rejectWithValue, signal }) => {
    try {
      return await fetchEventDetailsServices(eventId, { signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
  {
    condition: (eventId, { getState }) => {
      if (!isValidEventId(eventId)) {
        return false;
      }

      const { items, status } = getState().publicEvents;
      const event = items.find((e) => String(e?.id) === String(eventId));
      if (event) {
        return false;
      }

      return status !== 'loading';
    },
  }
);

export {
  fetchPublicEventsListAPI as fetchPublicEvents,
  fetchPublicEventDetailsAPI as fetchPublicEventDetails,
};
