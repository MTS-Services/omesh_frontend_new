import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../../../../../components/common/Modal';
import { request } from '../../../../../api/request';
import { handleApiError } from '../../../../../api/errorHandler';

const INITIAL_FORM = {
  amount: '',
  method: 'PAYPAL',
  accountNumber: '',
};

const METHOD_MAP = {
  PAYPAL: 'PAYPAL',
  BANK: 'BANK',
  CARD: 'CARD',
};

const WithdrawFundsModal = ({ open, onClose, availableBalance = 1200.5, onSuccess }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (Number(form.amount) > availableBalance) {
      setError(`Amount cannot exceed available balance $${availableBalance.toFixed(2)}`);
      return;
    }

    if (!form.accountNumber || form.accountNumber.trim() === '') {
      setError('Please enter an account number');
      return;
    }

    if (!form.method) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        amount: Number(form.amount),
        currency: 'USD',
        method: form.method,
        accountNumber: form.accountNumber.trim(),
      };

      await request({
        method: 'POST',
        url: '/api/v1/pay-request',
        data: payload,
      });

      toast.success('Withdrawal request submitted successfully');
      onClose();
      setForm(INITIAL_FORM);
      if (onSuccess) onSuccess();
    } catch (err) {
      const message = handleApiError(err);
      setError(message || 'Failed to submit withdrawal request');
      toast.error(message || 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="withdraw-form"
        disabled={loading}
        className="flex-1 rounded-lg bg-[#1FB356] py-3 text-sm font-semibold text-white transition hover:bg-[#188a47] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Requesting...' : 'Request'}
      </button>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="Withdraw Funds" size="sm" footer={footer}>
      <form id="withdraw-form" onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Enter amount</label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              disabled={loading}
              placeholder="120.00"
              step="0.01"
              min="0"
              max={availableBalance}
              className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-8 text-sm transition outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>
          <p className="mt-2 text-xs font-medium text-green-600">
            Available: ${availableBalance.toFixed(2)}
          </p>
        </div>

        {/* Payment Method */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Select payment method
          </label>
          <div className="relative">
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
              disabled={loading}
              className="w-full appearance-none rounded-lg border border-gray-200 py-3 pr-10 pl-4 text-sm transition outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-gray-50"
            >
              <option value="PAYPAL">PayPal</option>
              <option value="BANK">Bank Transfer</option>
              <option value="CARD">Card</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Account Number */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            disabled={loading}
            placeholder="012345678910"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm transition outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </form>
    </Modal>
  );
};

export default WithdrawFundsModal;
