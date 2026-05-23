import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleApiError } from '../../../api/errorHandler';
import { fetchRequestedEvents, updateEventStatus, deleteEvent } from './requestedEventsService';

export const fetchAdminRequestedEvents = createAsyncThunk(
  'adminRequestedEvents/fetchAll',
  async (query, { rejectWithValue, signal }) => {
    try {
      return await fetchRequestedEvents({ ...query, signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateAdminEventStatus = createAsyncThunk(
  'adminRequestedEvents/updateStatus',
  async ({ eventId, status }, { rejectWithValue }) => {
    try {
      await updateEventStatus({ eventId, status });
      return { eventId };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteAdminEvent = createAsyncThunk(
  'adminRequestedEvents/deleteEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      await deleteEvent({ eventId });
      return { eventId };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
