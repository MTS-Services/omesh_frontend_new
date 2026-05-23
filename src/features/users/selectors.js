export const selectUsers = (state) => state.users.items;
export const selectStatus = (state) => state.users.status;
export const selectLoading = (state) => state.users.status === 'loading';
export const selectError = (state) => state.users.error;
