export const selectOrganizerStats = (state) => state.organizerStats;
export const selectOrganizerStatsLoading = (state) => state.organizerStats.status === 'loading';
export const selectOrganizerStatsError = (state) => state.organizerStats.error;

export const selectOrganizerSalesByRange = (state, range) =>
	state.organizerStats.salesByRange[range] || [];
export const selectOrganizerSalesLoadingByRange = (state, range) =>
	state.organizerStats.salesStatusByRange[range] === 'loading';
export const selectOrganizerSalesErrorByRange = (state, range) =>
	state.organizerStats.salesErrorByRange[range] || null;

export const selectOrganizerTopEventByRange = (state, range) =>
	state.organizerStats.topEventByRange[range] || [];
export const selectOrganizerTopEventLoadingByRange = (state, range) =>
	state.organizerStats.topEventStatusByRange[range] === 'loading';
export const selectOrganizerTopEventErrorByRange = (state, range) =>
	state.organizerStats.topEventErrorByRange[range] || null;
