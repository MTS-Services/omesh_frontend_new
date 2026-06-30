import React, { useEffect, useMemo, useState } from 'react';
import { Save, LayoutGrid } from 'lucide-react';
import { request } from '../../../../api/request';

const EXAMPLE_TICKETS = [50, 75, 100, 200];
const BASE_PRICE = 120;

const SettingsView = () => {
  const [fee, setFee] = useState(0);
  const [input, setInput] = useState('0');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [saveState, setSaveState] = useState('idle');

  useEffect(() => {
    let ignore = false;

    const loadSettings = async () => {
      setStatus('loading');
      setError('');
      try {
        const payload = await request({
          url: '/api/v1/platform-setting',
          method: 'GET',
        });

        const settings = payload?.data ?? payload;
        const feeValue = Number(settings?.platformFeePct ?? 0);
        const safeFee = Number.isFinite(feeValue) ? Math.min(20, Math.max(0, feeValue)) : 0;
        const apiCurrency = settings?.currency || 'USD';

        if (!ignore) {
          setFee(safeFee);
          setInput(String(safeFee));
          setCurrency(apiCurrency);
          setStatus('succeeded');
        }
      } catch (err) {
        if (!ignore) {
          setStatus('failed');
          setError(err?.message || 'Failed to load platform settings');
        }
      }
    };

    loadSettings();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSlider = (e) => {
    const val = Number(e.target.value);
    setFee(val);
    setInput(String(val));
  };

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setInput(raw);
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 0 && num <= 20) setFee(num);
  };

  const handleSave = () => {
    const num = parseFloat(input);
    if (!isNaN(num) && num >= 0 && num <= 20) setFee(num);
  };

  const handleSaveSettings = async () => {
    const num = parseFloat(input);
    if (isNaN(num) || num < 0 || num > 20) {
      setError('Platform fee must be between 0 and 20');
      return;
    }

    setSaveState('saving');
    setError('');
    try {
      await request({
        url: '/api/v1/platform-setting',
        method: 'PATCH',
        data: {
          platformFeePct: num,
          currency,
        },
      });
      setFee(num);
      setInput(String(num));
      setSaveState('saved');
    } catch (err) {
      setError(err?.message || 'Failed to update platform settings');
      setSaveState('idle');
    }
  };

  const currencySymbol = useMemo(() => {
    if (currency === 'USD') return '$';
    if (currency === 'EUR') return 'EUR ';
    if (currency === 'GBP') return 'GBP ';
    if (currency === 'BDT') return 'BDT ';
    return `${currency} `;
  }, [currency]);

  const total = +(BASE_PRICE * (1 + fee / 100)).toFixed(2);

  if (status === 'loading') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-500">
        Loading platform settings...
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-600">
        {error || 'Failed to load platform settings'}
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">Platform Fee Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Control the platform fee percentage added to ticket prices
      </p>

      {/* Two-column layout */}
      <div className="mt-6 flex flex-col gap-6 sm:flex-row">
        {/* Left — Fee Configuration */}
        <div className="w-full shrink-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:w-75">
          <h2 className="text-base font-bold text-gray-900">Fee Configuration</h2>
          <p className="mt-0.5 text-xs text-gray-500">Platform Fee Percentage</p>

          {/* Slider */}
          <div className="mt-4">
            <div className="mb-1 flex justify-end text-sm font-semibold text-gray-700">{fee}%</div>
            <input
              type="range"
              min={0}
              max={20}
              step={0.5}
              value={fee}
              onChange={handleSlider}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-green-500"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Manual input */}
          <p className="mt-5 text-sm text-gray-600">Or enter manually</p>
          <div className="mt-2 flex items-center overflow-hidden rounded-lg border border-gray-200">
            <input
              type="text"
              value={input}
              onChange={handleInput}
              className="flex-1 px-3 py-2 text-sm text-gray-800 outline-none"
            />
            <span className="bg-gray-50 px-3 py-2 text-sm text-gray-500">%</span>
          </div>

          <p className="mt-4 text-sm text-gray-600">Currency</p>
          <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-white px-3 py-2 text-sm text-gray-800 outline-none"
            >
              <option value="USD">USD</option>
              {/* <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="BDT">BDT</option> */}
            </select>
          </div>

          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
          {saveState === 'saved' && (
            <p className="mt-3 text-xs text-green-600">Settings updated successfully.</p>
          )}

          {/* Save button */}
          <button
            onClick={() => {
              handleSave();
              handleSaveSettings();
            }}
            disabled={saveState === 'saving'}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-60"
          >
            <Save size={15} />
            {saveState === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Right — Live Calculation Preview */}
        <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-gray-500" />
            <h2 className="text-base font-bold text-gray-900">Live Calculation Preview</h2>
          </div>

          {/* Example Calculation */}
          <div className="mt-5 rounded-lg border border-gray-100 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Example Calculation
            </p>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Event Ticket Price:</span>
              <span className="font-medium">
                {currencySymbol}
                {BASE_PRICE.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-700">Platform Fee ({fee}%):</span>
              <span className="font-medium text-green-600">
                {currencySymbol}
                {total.toFixed(2)}
              </span>
            </div>
            <div className="mt-4 flex justify-between border-t border-gray-100 pt-3">
              <span className="text-sm font-semibold text-gray-800">Total User Pays:</span>
              <span className="text-xl font-bold text-gray-900">
                {currencySymbol}
                {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-4 rounded-lg bg-green-50 p-4">
            <p className="mb-2 text-xs font-bold tracking-wide text-green-700 uppercase">
              How It Works
            </p>
            <p className="text-sm leading-relaxed text-green-700">
              The platform fee is automatically added on top of the ticket price. Users see the
              total amount (ticket price + platform fee) when purchasing tickets.
            </p>
          </div>

          {/* Other Examples */}
          <p className="mt-5 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Other Examples
          </p>
          <div className="mt-2 divide-y divide-gray-50">
            {EXAMPLE_TICKETS.map((price) => {
              const f = +(price * (fee / 100)).toFixed(2);
              const t = +(price + f).toFixed(2);
              return (
                <div key={price} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-gray-700">
                    Ticket: {currencySymbol}
                    {price}
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <span className="text-gray-400">
                      Fee: {currencySymbol}
                      {f.toFixed(2)}
                    </span>
                    <span className="font-semibold text-gray-800">
                      = {currencySymbol}
                      {t.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
