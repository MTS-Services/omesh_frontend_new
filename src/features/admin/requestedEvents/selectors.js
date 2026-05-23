export const selectAdminRequestedEvents = (state) => state.adminRequestedEvents.items;
export const selectAdminRequestedEventsTotal = (state) => state.adminRequestedEvents.total;
export const selectAdminRequestedEventsPage = (state) => state.adminRequestedEvents.page;
export const selectAdminRequestedEventsLimit = (state) => state.adminRequestedEvents.limit;
export const selectAdminRequestedEventsLoading = (state) =>
  state.adminRequestedEvents.status === 'loading';
export const selectAdminRequestedEventsError = (state) => state.adminRequestedEvents.error;
export const selectAdminEventActionLoading = (state) => state.adminRequestedEvents.actionLoading;
export const selectAdminEventActionError = (state) => state.adminRequestedEvents.actionError;
