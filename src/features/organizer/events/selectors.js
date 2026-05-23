export const selectEvents = (state) => state.events.items;
export const selectEventsStatus = (state) => state.events.status;
export const selectEventsLoading = (state) => state.events.status === 'loading';
export const selectEventsError = (state) => state.events.error;
export const selectEventsMeta = (state) =>
  state.events.meta || { page: 1, limit: 10, total: 0, totalPages: 0 };
export const selectEventById = (id) => (state) => {
  // First check details object, then fall back to items array.
  // API IDs can be numeric or string (e.g. cuid), so normalize both forms.
  const key = String(id);
  const detailsEvent = state.events.details[key] || state.events.details[id];
  if (detailsEvent) return detailsEvent;

  return state.events.items.find((e) => String(e.id) === key);
};
