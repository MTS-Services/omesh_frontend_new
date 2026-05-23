import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers } from './userService';
import { handleApiError } from '../../api/errorHandler';

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await getUsers({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().users;
      return status !== 'succeeded'; // Only prevent if already ded
    },
  }
);
