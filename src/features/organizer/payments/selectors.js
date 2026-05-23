export const selectPaymentStats = (state) => state.payments.stats;
export const selectPaymentTransactions = (state) => state.payments.transactions;
export const selectAmountData = (state) => state.payments.singleValue;
export const selectPaymentsStatus = (state) => state.payments.status;
export const selectPaymentsLoading = (state) => state.payments.status === 'loading';
export const selectPaymentsError = (state) => state.payments.error;
