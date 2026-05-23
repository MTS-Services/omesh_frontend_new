export const selectDashboardStats = (state) => state.adminDashboard.stats;
export const selectDashboardStatus = (state) => state.adminDashboard.status;
export const selectDashboardLoading = (state) => state.adminDashboard.status === 'loading';
export const selectDashboardError = (state) => state.adminDashboard.error;
export const selectDashboardSalesCount = (state) => state.adminDashboard.salesCount;
export const selectDashboardSalesStatus = (state) => state.adminDashboard.salesStatus;
export const selectDashboardSalesLoading = (state) =>
	state.adminDashboard.salesStatus === 'loading';
export const selectDashboardSalesError = (state) => state.adminDashboard.salesError;
