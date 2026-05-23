export const selectPublicEvents = (state) => state.publicEvents.items;
export const selectPublicEventsStatus = (state) => state.publicEvents.status;
export const selectPublicEventsLoading = (state) => state.publicEvents.status === 'loading';
export const selectPublicEventsError = (state) => state.publicEvents.error;
export const selectPublicEventById = (id) => (state) =>
  state.publicEvents.items.find((e) => String(e?.id) === String(id));
