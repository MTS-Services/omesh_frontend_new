import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, FileText, FileSpreadsheet } from 'lucide-react';
import { request } from '../../../../../api/request';

const ITEMS_PER_PAGE = 10;

const COLUMNS = [
  'Name',
  'Email',
  'Source',
  'Coupon Code',
  'T-Shirt Size',
  'Date of Birth',
  'Age',
  'Gender',
];

const normalizeParticipant = (item) => ({
  id: item?.id ?? item?._id ?? item?.uuid ?? `${item?.name ?? item?.email ?? 'participant'}`,
  firstName: item?.firstName ?? item?.first_name ?? '',
  lastName: item?.lastName ?? item?.last_name ?? '',
  name: `${item?.firstName ?? item?.first_name ?? ''} ${item?.lastName ?? item?.last_name ?? ''}`.trim(),
  displayName:
    `${item?.firstName ?? item?.first_name ?? ''} ${item?.lastName ?? item?.last_name ?? ''}`.trim() ||
    item?.name ||
    item?.userName ||
    item?.fullName ||
    item?.user ||
    '',
  email: item?.email ?? item?.mail ?? '',
  source: resolveStringValue(
    item?.source ?? item?.registrationSource ?? item?.origin ?? item?.referral ?? item?.registration?.source ?? item?.user?.source ?? '',
  ),
  couponCode: resolveStringValue(
    item?.couponCode ?? item?.promoCode ?? item?.promo_code ?? item?.coupon_code ?? item?.promo?.code ?? item?.registration?.promoCode ?? item?.registration?.promo?.code ?? item?.coupon?.code ?? item?.meta?.couponCode ?? '',
  ),
  location: item?.location ?? item?.city ?? item?.country ?? '',
  selectedTShirtSize: item?.selectedTShirtSize ?? item?.tShirtSize ?? item?.tshirtSize ?? item?.shirtSize ?? '',
  dob: item?.dob ?? item?.dateOfBirth ?? item?.birthDate ?? '',
  age: item?.age ?? '',
  gender: item?.gender ?? '',
});

const resolveStringValue = (value) => {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return (
      (value.name && String(value.name).trim()) ||
      (value.value && String(value.value).trim()) ||
      (value.code && String(value.code).trim()) ||
      (value.label && String(value.label).trim()) ||
      ''
    );
  }
  return String(value);
};

const formatDateOfBirth = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '-';

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [year, month, day] = raw.split('-');
    return `${day}/${month}/${year}`;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
};

const ParticipantList = ({ participants: initialParticipants, eventId, refreshKey = 0 }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: ITEMS_PER_PAGE,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const location = useLocation();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await request({
          method: 'GET',
          url: '/api/v1/event-registration',
          params: {
            eventId: eventId,
            page,
            limit: ITEMS_PER_PAGE,
            ...(search.trim() ? { search: search.trim() } : {}),
          },
        });

        const payload = response?.data ?? response;
          // Dev: log payload to inspect available fields (remove in production)
          try {
            console.debug('participant fetch payload:', payload);
            if (Array.isArray(payload) ? payload.length > 0 : Array.isArray(payload?.data) && payload.data.length > 0) {
              console.debug('first participant item:', (Array.isArray(payload) ? payload[0] : payload.data[0]));
            }
          } catch {
            // ignore
          }
        const data = Array.isArray(payload) ? payload : payload?.data || [];
        const responseMeta = payload?.meta || {};

        const normalized = data.map(normalizeParticipant);
        setParticipants(normalized);
        setMeta({
          currentPage: responseMeta.currentPage ?? page,
          totalPages: responseMeta.totalPages ?? 1,
          totalItems: responseMeta.totalItems ?? data.length,
          itemsPerPage: responseMeta.itemsPerPage ?? ITEMS_PER_PAGE,
          hasNextPage: responseMeta.hasNextPage ?? page < (responseMeta.totalPages ?? 1),
          hasPreviousPage: responseMeta.hasPreviousPage ?? page > 1,
        });
      } catch (error) {
        console.error('Failed to fetch participants:', error);
        const fallback = (initialParticipants || []).map(normalizeParticipant);
        setParticipants(fallback);
        setMeta({
          currentPage: 1,
          totalPages: 1,
          totalItems: (initialParticipants || []).length,
          itemsPerPage: ITEMS_PER_PAGE,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [initialParticipants, page, search, eventId, refreshKey]);

  const handleDownloadCsv = async () => {
    try {
      const params = {
        ...Object.fromEntries(new URLSearchParams(location.search)),
        eventId: eventId,
        ...(search.trim() ? { search: search.trim() } : {}),
      };
      const response = await request({
        method: 'GET',
        url: '/api/v1/event-registration/export/csv',
        params,
      });

      const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'event-registration.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const params = {
        ...Object.fromEntries(new URLSearchParams(location.search)),
        eventId: eventId,
        ...(search.trim() ? { search: search.trim() } : {}),
      };
      const response = await request({
        method: 'GET',
        url: '/api/v1/event-registration/export/excel',
        params,
      });

      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'event-registration.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download EXCEL:', error);
    }
  };

  const pageStart = (meta.currentPage - 1) * meta.itemsPerPage;
  const pageEnd = pageStart + participants.length;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="text-xl font-bold text-gray-900">Participant List</h2>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name..."
              className="w-full rounded-xl border border-gray-200 py-2 pr-4 pl-9 text-sm text-gray-700 outline-none focus:border-[#1FB356] focus:ring-1 focus:ring-[#1FB356]"
            />
          </div>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1FB356] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#188a47] sm:w-auto"
          >
            <FileText size={16} />
            Download CSV File
          </button>
          <button
            type="button"
            onClick={handleDownloadExcel}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1FB356] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#188a47] sm:w-auto"
          >
            <FileSpreadsheet size={16} />
            Download EXCEL File
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full max-w-full overflow-x-auto overscroll-x-contain pb-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading participants...</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">No participants found</p>
          </div>
        ) : (
          <table className="w-full text-sm sm:min-w-225">
            <thead className="sticky top-0 z-10 hidden bg-white sm:table-header-group">
              <tr className="border-b border-gray-100 text-left">
                {COLUMNS.map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 font-normal text-gray-700 sm:px-6 sm:py-4 ${
                      h === 'T-Shirt Size' ? 'text-center' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="block sm:table-row-group">
              {participants.map((p) => (
                <tr
                  key={p.id}
                  className="m-2 block rounded-lg border border-gray-100 bg-white hover:bg-gray-50 sm:m-0 sm:table-row sm:rounded-none sm:border-0 sm:border-b sm:last:border-0"
                >
                  <td className="flex items-start justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-right text-gray-900 sm:table-cell sm:border-0 sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Name</span>
                    <span className="max-w-[65%] wrap-break-word sm:max-w-none">
                      {p.displayName || p.name || `${p.firstName} ${p.lastName}`.trim() || '-'}
                    </span>
                  </td>
                  <td className="flex items-start justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Email</span>
                    <span className="max-w-[65%] break-all sm:max-w-none">{p.email || '-'}</span>
                  </td>
                  <td className="flex items-start justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Source</span>
                    <span className="max-w-[65%] wrap-break-word sm:max-w-none">{p.source || '-'}</span>
                  </td>
                  <td className="flex items-start justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Coupon Code</span>
                    <span className="max-w-[65%] break-all sm:max-w-none">{p.couponCode || '-'}</span>
                  </td>
                  <td className="flex items-center justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-center text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5 ">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">T-Shirt Size</span>
                    <span className="w-full max-w-[65%] wrap-break-word sm:max-w-none text-center ">
                      {p.selectedTShirtSize || '-'}
                    </span>
                  </td>
                  <td className="flex items-start justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">
                      Date of Birth
                    </span>
                    <span className="max-w-[65%] wrap-break-word sm:max-w-none">
                      {formatDateOfBirth(p.dob)}
                    </span>
                  </td>
                  <td className="flex items-start justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Age</span>
                    <span className="max-w-[65%] wrap-break-word sm:max-w-none">
                      {p.age || '-'}
                    </span>
                  </td>
                  <td className="flex items-start justify-between gap-3 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Gender</span>
                    <span className="max-w-[65%] wrap-break-word sm:max-w-none">
                      {p.gender || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-[#22C55E]">
          Showing {participants.length === 0 ? 0 : pageStart + 1} to {pageEnd} of {meta.totalItems}{' '}
          results
        </p>
        <div className="grid grid-cols-3 items-center gap-2 sm:flex">
          <button
            type="button"
            disabled={!meta.hasPreviousPage || page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="rounded-xl border border-[#22C55E] px-3 py-1.5 text-sm font-medium text-[#22C55E] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
          >
            Previous
          </button>
          <span className="min-w-20 text-center text-sm font-medium text-gray-700">
            Page {meta.currentPage} of {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={!meta.hasNextPage || page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-[#22C55E] px-3 py-1.5 text-sm font-medium text-[#22C55E] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantList;
