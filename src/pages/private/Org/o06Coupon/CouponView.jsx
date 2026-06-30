import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Send, PencilLine } from 'lucide-react';
import { toast } from 'react-toastify';
import { request } from '../../../../api/request';
import { ENDPOINT } from '../../../../api/config/endpoints';

const isValidEmail = (value) => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
};

const normalizeEmail = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();

const resolveEmailValue = (value) => {
  if (value && typeof value === 'object') {
    return (
      value.email ??
      value.allowedEmail ??
      value.allowed_email ??
      value.recipient ??
      value.value ??
      value.address ??
      value.id ??
      ''
    );
  }

  return value;
};

const normalizeEmailList = (values) =>
  Array.isArray(values)
    ? values.map((value) => normalizeEmail(resolveEmailValue(value))).filter(Boolean)
    : [];

const resolveDescriptionValue = (value) => {
  if (value && typeof value === 'object') {
    return (
      value.description ??
      value.promoDescription ??
      value.promo_description ??
      value.title ??
      value.name ??
      value.value ??
      ''
    );
  }

  return value;
};

const resolvePromoId = (item, index) => {
  const candidate = item?._id ?? item?.id ?? item?.promoId ?? item?.promo_id ?? index;

  if (candidate && typeof candidate === 'object') {
    const nestedCandidate =
      candidate._id ?? candidate.id ?? candidate.promoId ?? candidate.promo_id ?? index;

    return String(nestedCandidate);
  }

  return String(candidate);
};

const formatDateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const toIsoDateTime = (value, endOfDay = false) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const suffix = endOfDay ? 'T23:59:59Z' : 'T00:00:00Z';
  return raw.includes('T') ? raw : `${raw}${suffix}`;
};

const normalizePromoHistory = (response) => {
  const payload = response?.data ?? response;
  const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

  return list.map((item, index) => ({
    id: resolvePromoId(item, index),
    code: item.code || '-',
    description: String(
      resolveDescriptionValue(
        item.description ??
          item.promoDescription ??
          item.promo_description ??
          item.title ??
          item.name ??
          ''
      )
    ),
    userid: item.userid || '',
    allowedEmails: Array.isArray(item.allowedEmails)
      ? normalizeEmailList(item.allowedEmails)
      : Array.isArray(item.allowedemails)
        ? normalizeEmailList(item.allowedemails)
        : [],
    redeemedCount: Number(item.redeemedCount || 0),
    startsAt: item.startsAt || '',
    expiresAt: item.expiresAt || '',
    isActive: Boolean(item.isActive),
    createdAt: item.createdAt || '',
    updatedAt: item.updatedAt || '',
  }));
};

const CouponView = () => {
  const [manualEmail, setManualEmail] = useState('');
  const [manualRecipients, setManualRecipients] = useState([]);
  const [bulkRecipients, setBulkRecipients] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState('');
  const [editingPromoId, setEditingPromoId] = useState('');
  const [showEditBanner, setShowEditBanner] = useState(false);

  const resetPromoForm = () => {
    setManualRecipients([]);
    setBulkRecipients([]);
    setCouponCode('');
    setDescription('');
    setStartsAt('');
    setExpiryDate('');
    setManualEmail('');
    setIsActive(true);
    setEditingPromoId('');
  };

  const fillPromoForm = (promo) => {
    setEditingPromoId(String(promo?.id || ''));
    setCouponCode(String(promo?.code || ''));
    setDescription(
      String(
        resolveDescriptionValue(
          promo?.description ??
            promo?.promoDescription ??
            promo?.promo_description ??
            promo?.title ??
            promo?.name ??
            ''
        )
      )
    );
    setStartsAt(String(promo?.startsAt || '').slice(0, 10));
    setExpiryDate(String(promo?.expiresAt || '').slice(0, 10));
    setManualRecipients(normalizeEmailList(promo?.allowedEmails));
    setBulkRecipients([]);
    setManualEmail('');
    setIsActive(Boolean(promo?.isActive));
    setShowEditBanner(true);
  };

  useEffect(() => {
    const fetchPromoHistory = async () => {
      try {
        setHistoryLoading(true);
        setHistoryError('');

        const response = await request({
          method: 'GET',
          url: ENDPOINT.ORGANIZER.PROMO,
        });

        setHistory(normalizePromoHistory(response));
      } catch (error) {
        const message =
          error?.response?.data?.message || error?.message || 'Failed to load coupon history.';
        setHistoryError(message);
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchPromoHistory();
  }, []);

  // Auto-hide body error messages after 3 seconds
  useEffect(() => {
    if (!historyError) return undefined;
    const t = setTimeout(() => setHistoryError(''), 3000);
    return () => clearTimeout(t);
  }, [historyError]);

  // Auto-hide the edit-mode banner after 3 seconds, but keep edit mode active
  useEffect(() => {
    if (!editingPromoId) {
      setShowEditBanner(false);
      return undefined;
    }

    // show immediately when editingPromoId set
    setShowEditBanner(true);
    const t = setTimeout(() => setShowEditBanner(false), 3000);
    return () => clearTimeout(t);
  }, [editingPromoId]);

  const recipients = useMemo(() => {
    const merged = [...manualRecipients, ...bulkRecipients];
    const unique = [];
    const seen = new Set();

    merged.forEach((email) => {
      const normalized = normalizeEmail(email);
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      unique.push(normalized);
    });

    return unique;
  }, [manualRecipients, bulkRecipients]);

  const addManualRecipient = () => {
    const email = normalizeEmail(manualEmail);

    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (manualRecipients.includes(email)) {
      toast.error('This email is already in manual recipient list');
      return;
    }

    setManualRecipients((prev) => [...prev, email]);
    setManualEmail('');
  };

  const removeManualRecipient = (email) => {
    setManualRecipients((prev) => prev.filter((item) => item !== email));
  };

  const handleHistoryStatusChange = async (entryId, nextStatus) => {
    const nextIsActive = nextStatus === 'Active';
    let previousIsActive = nextIsActive;

    setHistory((prevHistory) =>
      prevHistory.map((entry) => {
        if (entry.id !== entryId) return entry;
        previousIsActive = entry.isActive;
        return { ...entry, isActive: nextIsActive };
      })
    );

    try {
      await request({
        method: 'PATCH',
        url: ENDPOINT.ORGANIZER.PROMO_BY_ID(entryId),
        data: { isActive: nextIsActive },
      });

      toast.success(`Promo marked as ${nextStatus}`);
    } catch (error) {
      setHistory((prevHistory) =>
        prevHistory.map((entry) =>
          entry.id === entryId ? { ...entry, isActive: previousIsActive } : entry
        )
      );

      const message =
        error?.response?.data?.message || error?.message || 'Failed to update promo status.';
      toast.error(message);
    }
  };

  const handleDeletePromo = (entryId) => {
    if (!entryId) {
      toast.error('Promo id is missing');
      return;
    }

    setPendingDeleteId(entryId);
  };

  const handleEditPromo = (entry) => {
    const promoId = entry?.id;

    if (!promoId) {
      toast.error('Promo id is missing');
      return;
    }

    fillPromoForm({
      ...entry,
      allowedEmails: Array.isArray(entry?.allowedEmails) ? entry.allowedEmails : [],
    });

    toast.info('Promo loaded for editing');
  };

  const confirmDeletePromo = async () => {
    const entryId = pendingDeleteId;
    if (!entryId) {
      toast.error('Promo id is missing');
      return;
    }

    setPendingDeleteId('');

    setDeletingId(entryId);

    try {
      await request({
        method: 'DELETE',
        url: ENDPOINT.ORGANIZER.PROMO_BY_ID(entryId),
      });

      setHistory((prevHistory) => prevHistory.filter((entry) => entry.id !== entryId));
      toast.success('Promo code deleted successfully');
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to delete promo code.';
      toast.error(message);
    } finally {
      setDeletingId('');
    }
  };

  const cancelDeletePromo = () => {
    setPendingDeleteId('');
    toast.info('Delete cancelled');
  };

  const savePromo = async () => {
    const code = couponCode.trim().toUpperCase();
    const trimmedDescription = description.trim();
    const normalizedStartsAt = toIsoDateTime(startsAt, false);
    const normalizedExpiresAt = toIsoDateTime(expiryDate, true);

    if (!editingPromoId && !code) {
      toast.error('Please enter promo code');
      return;
    }
    if (!trimmedDescription) {
      toast.error('Please enter promo description');
      return;
    }
    if (!startsAt) {
      toast.error('Please select start date');
      return;
    }
    if (!expiryDate) {
      toast.error('Please select expiry date');
      return;
    }
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient email');
      return;
    }

    setIsSending(true);

    try {
      const payload = {
        code: code || undefined,
        description: trimmedDescription,
        startsAt: normalizedStartsAt,
        expiresAt: normalizedExpiresAt,
        isActive,
        allowedEmails: recipients,
      };

      console.log('Saving promo with payload:', payload, 'Editing promo id:', editingPromoId);

      if (editingPromoId) {
        await request({
          method: 'PATCH',
          url: ENDPOINT.ORGANIZER.PROMO_BY_ID(editingPromoId),
          data: payload,
        });
      } else {
        // await request({
        //   method: 'POST',
        //   url: ENDPOINT.ORGANIZER.PROMO,
        //   data: payload,
        // });
      }

      const response = await request({
        method: 'GET',
        url: ENDPOINT.ORGANIZER.PROMO,
      });

      setHistory(normalizePromoHistory(response));
      toast.success(
        editingPromoId
          ? 'Promo updated successfully'
          : `Coupon sent to ${recipients.length} recipient(s)`
      );

      resetPromoForm();
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to save promo code.';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    resetPromoForm();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Promo Code Management</h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-500">
          Create promo codes for selected users by adding emails manually or uploading them in bulk.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">Promo Setup</h2>

        {editingPromoId && showEditBanner ? (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Editing promo code. Promo Code is locked, but Allowed Emails, Expires At, and Status can
            be updated.
          </div>
        ) : null}

        <h3 className="mb-3 text-base font-semibold text-gray-800">Allowed Emails</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={manualEmail}
            onChange={(e) => setManualEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addManualRecipient();
              }
            }}
            placeholder="Enter recipient email"
            className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-3 text-sm text-[#42444A] outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={addManualRecipient}
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1FB356] px-4 text-sm font-semibold text-white transition hover:bg-[#188a47] sm:w-auto"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="mt-4 max-h-52 space-y-2 overflow-y-auto pr-1">
          {manualRecipients.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-200 p-3 text-sm text-gray-500">
              No allowed email added yet.
            </p>
          ) : (
            manualRecipients.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
              >
                <span className="truncate text-sm text-gray-700">{email}</span>
                <button
                  type="button"
                  onClick={() => removeManualRecipient(email)}
                  className="rounded-md p-1 text-red-500 hover:bg-red-50"
                  aria-label={`Remove ${email}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3 xl:gap-4">
          {/* Promo Code */}
          <div className="min-w-0 space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Promo Code</label>
            <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter promo code"
                readOnly={Boolean(editingPromoId)}
                aria-readonly={Boolean(editingPromoId)}
                className="h-11 min-h-11 flex-1 rounded-lg border border-gray-300 px-3 text-sm text-[#42444A] outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              {/* <button
                type="button"
                onClick={generatePromoCode}
                className="text-white bg-green-500 inline-flex h-11 w-full shrink-0 items-center justify-center rounded-lg border border-gray-300  px-3 text-sm font-semibold   sm:w-auto"
              >
                <TicketPercent size={16} className="mr-2" />
                Generate
              </button> */}
            </div>
          </div>

          {/* Starts At */}
          <div className="min-w-0 space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Starts At</label>
            <input
              type="date"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-3 text-sm text-[#42444A] outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Expires At */}
          <div className="min-w-0 space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Expires At</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="h-11 w-full min-w-0 rounded-lg border border-gray-300 px-3 text-sm text-[#42444A] outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="min-w-0 space-y-1.5 md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
              className="min-h-26 w-full min-w-0 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#42444A] outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Toggle + Action Buttons */}
          <div className="grid grid-cols-1 gap-3 md:col-span-3 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setIsActive((prev) => !prev)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
                  isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isActive ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="hidden md:block" />

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={savePromo}
                disabled={isSending}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1FB356] px-4 text-sm font-semibold text-white transition hover:bg-[#188a47] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Send size={16} />
                {isSending
                  ? editingPromoId
                    ? 'Updating...'
                    : 'Creating...'
                  : editingPromoId
                    ? 'Update Promo Code'
                    : 'Create Promo Code'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <h2 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">Coupon Send History</h2>

        <div className="space-y-3 md:hidden">
          {historyLoading ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
              Loading promo history...
            </div>
          ) : historyError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-500">
              {historyError}
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
              No promo history yet.
            </div>
          ) : (
            history.map((entry) => (
              <article key={entry.id} className="rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{entry.code}</h3>
                    <p className="mt-1 text-sm text-gray-500">{entry.description || '-'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePromo(entry.id)}
                    disabled={deletingId === entry.id}
                    aria-label={`Delete promo ${entry.code}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditPromo(entry)}
                    disabled={isSending}
                    aria-label={`Edit promo ${entry.code}`}
                    className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <PencilLine size={16} />
                  </button>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Redeemed</dt>
                    <dd className="mt-1 font-medium text-gray-900">{entry.redeemedCount}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <select
                        value={entry.isActive ? 'Active' : 'Inactive'}
                        onChange={(e) => handleHistoryStatusChange(entry.id, e.target.value)}
                        className={`w-full rounded-lg border px-3 py-1.5 text-sm font-semibold outline-none ${
                          entry.isActive
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-gray-500">Starts At</dt>
                    <dd className="mt-1 font-medium text-gray-900">
                      {formatDateOnly(entry.startsAt)}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-gray-500">Expires At</dt>
                    <dd className="mt-1 font-medium text-gray-900">
                      {formatDateOnly(entry.expiresAt)}
                    </dd>
                  </div>
                </dl>
              </article>
            ))
          )}
        </div>

        <div className="hidden w-full overflow-x-auto rounded-xl border border-gray-200 bg-white md:block">
          {historyLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading promo history...</div>
          ) : historyError ? (
            <div className="bg-red-50 p-4 text-center text-sm text-red-500">{historyError}</div>
          ) : history.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No promo history yet.</div>
          ) : (
            <table className="w-full min-w-245 text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold whitespace-nowrap text-gray-700">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left font-semibold whitespace-nowrap text-gray-700">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center font-semibold whitespace-nowrap text-gray-700">
                    Redeemed
                  </th>
                  <th className="px-6 py-4 text-left font-semibold whitespace-nowrap text-gray-700">
                    Starts At
                  </th>
                  <th className="px-6 py-4 text-left font-semibold whitespace-nowrap text-gray-700">
                    Expires At
                  </th>
                  <th className="px-6 py-4 text-center font-semibold whitespace-nowrap text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-semibold whitespace-nowrap text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
                      {entry.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {entry.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-900">
                      {entry.redeemedCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {formatDateOnly(entry.startsAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {formatDateOnly(entry.expiresAt)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <select
                        value={entry.isActive ? 'Active' : 'Inactive'}
                        onChange={(e) => handleHistoryStatusChange(entry.id, e.target.value)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-semibold outline-none ${
                          entry.isActive
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDeletePromo(entry.id)}
                        disabled={deletingId === entry.id}
                        aria-label={`Delete promo ${entry.code}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditPromo(entry)}
                        disabled={isSending}
                        aria-label={`Edit promo ${entry.code}`}
                        className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-sm text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <PencilLine size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {pendingDeleteId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete Promo Code</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this promo code? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelDeletePromo}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePromo}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CouponView;
