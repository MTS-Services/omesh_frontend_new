import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import eventsReducer from '../features/organizer/events/eventsSlice';
import paymentsReducer from '../features/organizer/payments/paymentsSlice';
import organizerStatsReducer from '../features/organizer/stats/statsSlice';
import publicEventsReducer from '../features/public/events/eventsSlice';
import publicTrainingReducer from '../features/public/training/trainingSlice';
import publicTrainingPlansReducer from '../features/public/trainingPlans/trainingPlansSlice';
import adminDashboardReducer from '../features/admin/dashboard/dashboardSlice';
import adminRequestedEventsReducer from '../features/admin/requestedEvents/requestedEventsSlice';
import trainingReducer from '../features/admin/trainingPlans/trainingSlice';
import trainingStructuresReducer from '../features/admin/trainingPlans/trainingStructureSlice';
import payRequestReducer from '../features/admin/payRequest/payRequestSlice';
import adminToolkitReducer from '../features/admin/toolkit/toolkitSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    events: eventsReducer,
    payments: paymentsReducer,
    organizerStats: organizerStatsReducer,
    publicEvents: publicEventsReducer,
    publicTraining: publicTrainingReducer,
    publicTrainingPlans: publicTrainingPlansReducer,
    adminDashboard: adminDashboardReducer,
    adminRequestedEvents: adminRequestedEventsReducer,
    training: trainingReducer,
    trainingStructures: trainingStructuresReducer,
    payRequests: payRequestReducer,
    adminToolkit: adminToolkitReducer,
  },
});

export default store;
