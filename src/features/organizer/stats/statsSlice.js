import { createSlice } from '@reduxjs/toolkit';
import { fetchOrganizerSalesCount, fetchOrganizerStats, fetchOrganizerTopEvent } from './statsAPI';

const RANGES = ['week', 'month', 'year'];

const getListFromPayload = (payload) => {
  const rawData = payload?.response?.data ?? payload?.response ?? [];
  return Array.isArray(rawData) ? rawData : [];
};

const pick = (...values) => {
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] !== undefined && values[i] !== null) {
      return values[i];
    }
  }
  return null;
};

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const normalizeSalesData = (items) =>
  items.map((item, index) => ({
    label: String(
      pick(
        item.label,
        item.period,
        item.month,
        item.week,
        item.day,
        item.name,
        item.title,
        item._id,
        `Item ${index + 1}`
      )
    ),
    value: toNumber(
      pick(item.value, item.count, item.totalSales, item.salesCount, item.revenue, item.amount, 0)
    ),
  }));

const normalizeTopEventData = (items) =>
  items.map((item, index) => ({
    label: String(
      pick(item.label, item.name, item.eventName, item.title, item.event, `Event ${index + 1}`)
    ),
    value: toNumber(pick(item.value, item.count, item.participants, item.totalParticipants, 0)),
  }));

const createRangeState = (defaultValue) =>
  RANGES.reduce((accumulator, range) => {
    accumulator[range] = defaultValue;
    return accumulator;
  }, {});

const initialState = {
  totalEvents: 0,
  pendingApproval: 0,
  monthlyParticipants: 0,
  totalRevenue: 0,
  status: 'idle',
  error: null,
  salesByRange: createRangeState([]),
  salesStatusByRange: createRangeState('idle'),
  salesErrorByRange: createRangeState(null),
  topEventByRange: createRangeState([]),
  topEventStatusByRange: createRangeState('idle'),
  topEventErrorByRange: createRangeState(null),
};

const statsSlice = createSlice({
  name: 'organizerStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizerStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrganizerStats.fulfilled, (state, action) => {
        const stats = action.payload?.data || action.payload || {};

        state.status = 'succeeded';
        state.totalEvents = Number(stats.totalEvents ?? 0);
        state.pendingApproval = Number(stats.statusStats?.PENDING ?? 0);
        state.monthlyParticipants = Number(stats.monthlyParticipants ?? 0);
        state.totalRevenue = Number(stats.totalRevenue ?? 0);
      })
      .addCase(fetchOrganizerStats.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }

        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchOrganizerSalesCount.pending, (state, action) => {
        const range = action.meta.arg;
        state.salesStatusByRange[range] = 'loading';
        state.salesErrorByRange[range] = null;
      })
      .addCase(fetchOrganizerSalesCount.fulfilled, (state, action) => {
        const range = action.payload.range;
        state.salesStatusByRange[range] = 'succeeded';
        state.salesByRange[range] = normalizeSalesData(getListFromPayload(action.payload));
      })
      .addCase(fetchOrganizerSalesCount.rejected, (state, action) => {
        const range = action.meta.arg;

        if (action.meta.aborted) {
          state.salesStatusByRange[range] = 'idle';
          return;
        }

        state.salesStatusByRange[range] = 'failed';
        state.salesErrorByRange[range] = action.payload;
      })

      .addCase(fetchOrganizerTopEvent.pending, (state, action) => {
        const range = action.meta.arg;
        state.topEventStatusByRange[range] = 'loading';
        state.topEventErrorByRange[range] = null;
      })
      .addCase(fetchOrganizerTopEvent.fulfilled, (state, action) => {
        const range = action.payload.range;
        state.topEventStatusByRange[range] = 'succeeded';
        state.topEventByRange[range] = normalizeTopEventData(getListFromPayload(action.payload));
      })
      .addCase(fetchOrganizerTopEvent.rejected, (state, action) => {
        const range = action.meta.arg;

        if (action.meta.aborted) {
          state.topEventStatusByRange[range] = 'idle';
          return;
        }

        state.topEventStatusByRange[range] = 'failed';
        state.topEventErrorByRange[range] = action.payload;
      });
  },
});

export default statsSlice.reducer;
