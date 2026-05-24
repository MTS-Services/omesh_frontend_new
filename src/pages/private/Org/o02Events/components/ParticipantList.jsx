import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, FileText, FileSpreadsheet } from 'lucide-react';
import { request } from '../../../../../api/request';
import ServerPagination from '../../../../../components/ui/navigation/ServerPagination';

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
const VITE_API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '').trim();
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
    item?.source ??
      item?.registrationSource ??
      item?.origin ??
      item?.referral ??
      item?.registration?.source ??
      item?.user?.source ??
      ''
  ),
  couponCode: resolveStringValue(
    item?.couponCode ??
      item?.promoCode ??
      item?.promo_code ??
      item?.coupon_code ??
      item?.promo?.code ??
      item?.registration?.promoCode ??
      item?.registration?.promo?.code ??
      item?.coupon?.code ??
      item?.meta?.couponCode ??
      ''
  ),
  location: item?.location ?? item?.city ?? item?.country ?? '',
  selectedTShirtSize:
    item?.selectedTShirtSize ?? item?.tShirtSize ?? item?.tshirtSize ?? item?.shirtSize ?? '',
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
  const initialParticipantsRef = useRef(initialParticipants);
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
            pageNo: page,
            pageNumber: page,
            currentPage: page,
            limit: ITEMS_PER_PAGE,
            pageSize: ITEMS_PER_PAGE,
            perPage: ITEMS_PER_PAGE,
            ...(search.trim() ? { search: search.trim() } : {}),
          },
        });
// console.log('============',response);

        // The `request` helper returns `response.data` (axios response.data).
        // Some backends return `{ data: [...], meta: { ... } }` and some return
        // `{ items: [...], pagination: { ... } }`. Avoid accidentally
        // overwriting the top-level meta when `response.data` exists.
        const looksLikeTopLevelMeta =
          response && (response.meta || response.pagination || response.total || response.count || response.totalItems || response.totalCount);

        const payload = looksLikeTopLevelMeta ? response : response?.data ?? response;
        console.debug('participant fetch raw response:', response, '=> payload:', payload);
        // Dev: log payload to inspect available fields (remove in production)
        try {
          console.debug('participant fetch payload:', payload);
          if (
            Array.isArray(payload)
              ? payload.length > 0
              : Array.isArray(payload?.data) && payload.data.length > 0
          ) {
            console.debug(
              'first participant item:',
              Array.isArray(payload) ? payload[0] : payload.data[0]
            );
          }
        } catch {
          // ignore
        }
        const data = Array.isArray(payload) ? payload : payload?.data || [];

        // If backend returned a `meta` object, prefer it directly (map common keys)
        if (payload && payload.meta) {
          const m = payload.meta;
          const totalItems = Number(m.totalItems ?? m.total ?? m.count ?? m.total_count ?? m.totalCount) || data.length;
          const itemsPerPage =
            Number(m.itemsPerPage ?? m.perPage ?? m.limit ?? m.pageSize ?? m.per_page) || ITEMS_PER_PAGE;
          const totalPages = Number(m.totalPages ?? m.total_pages ?? m.pageCount ?? Math.ceil(totalItems / itemsPerPage)) || Math.max(1, Math.ceil(totalItems / itemsPerPage));
          const currentPage = Number(m.currentPage ?? m.current_page ?? m.page) || page;
          const hasNextPage = m.hasNextPage ?? m.has_next_page ?? (currentPage < totalPages);
          const hasPreviousPage = m.hasPreviousPage ?? m.has_previous_page ?? currentPage > 1;

          const normalized = data.map(normalizeParticipant);
          setParticipants(normalized);
          setMeta({
            currentPage,
            totalPages,
            totalItems,
            itemsPerPage,
            hasNextPage,
            hasPreviousPage,
          });
        } else {
          // Fallback: infer pagination from other shapes
          const paginationCandidates = {
            totalItems: payload?.total ?? payload?.count ?? payload?.total_count ?? payload?.totalCount,
            itemsPerPage: payload?.limit ?? payload?.per_page ?? payload?.pageSize ?? ITEMS_PER_PAGE,
            totalPages: payload?.totalPages ?? payload?.pages ?? null,
            currentPage: payload?.page ?? page,
            hasNextPage: payload?.hasNextPage ?? null,
            hasPreviousPage: payload?.hasPreviousPage ?? null,
          };

          const inferredTotalItems = Number(paginationCandidates.totalItems ?? null);
          const inferredItemsPerPage = Number(paginationCandidates.itemsPerPage || ITEMS_PER_PAGE);
          const inferredTotalPages =
            Number(paginationCandidates.totalPages) ||
            (inferredTotalItems > 0 ? Math.max(1, Math.ceil(inferredTotalItems / inferredItemsPerPage)) : Math.max(1, Math.ceil((data.length || 0) / inferredItemsPerPage)));

          const normalized = data.map(normalizeParticipant);
          setParticipants(normalized);

          setMeta({
            currentPage: Number(paginationCandidates.currentPage) || page,
            totalPages: inferredTotalPages,
            totalItems: inferredTotalItems || data.length,
            itemsPerPage: inferredItemsPerPage,
            hasNextPage:
              paginationCandidates.hasNextPage ??
              (inferredTotalItems ? page < Math.ceil(inferredTotalItems / inferredItemsPerPage) : normalized.length === inferredItemsPerPage),
            hasPreviousPage: paginationCandidates.hasPreviousPage ?? page > 1,
          });
        }
      } catch (error) {
        console.error('Failed to fetch participants:', error);
        const fallback = (initialParticipantsRef.current || []).map(normalizeParticipant);
        setParticipants(fallback);
        setMeta({
          currentPage: 1,
          totalPages: 1,
          totalItems: (initialParticipantsRef.current || []).length,
          itemsPerPage: ITEMS_PER_PAGE,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [page, search, eventId, refreshKey]);

  const currentPage = Number(meta.currentPage) || page;
  const totalPages = Math.max(
    1,
    Number(meta.totalPages) || Math.ceil((meta.totalItems || 0) / (meta.itemsPerPage || ITEMS_PER_PAGE)) || 1
  );
  const itemsPerPage = Number(meta.itemsPerPage) || ITEMS_PER_PAGE;
  const pageStart = participants.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const pageEnd =
    participants.length === 0
      ? 0
      : Math.min((currentPage - 1) * itemsPerPage + participants.length, meta.totalItems || 0);
  const canGoPrevious = meta.hasPreviousPage ?? currentPage > 1;
  const canGoNext = meta.hasNextPage ?? currentPage < totalPages;

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
      // console.log("=============>",params);

      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/event-registration/export/excel?eventId=${eventId}`,
        {
          method: 'GET',
          headers: {},
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download file from server');
      }

      const blob = await response.blob();
      // console.log('Downloaded blob size:', blob.size);
      const excelBlob = new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
                  
      const downloadUrl = window.URL.createObjectURL(excelBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `event-registration-${Date.now()}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download EXCEL:', error);
    }
  };

  // console.log('Participants:', meta);

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
                      {p.displayName || p.name || `${p.firstName} ${p.lastName}`.trim() || 'N/A'}
                    </span>
                  </td>
                  <td className="flex items-start justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Email</span>
                    <span className="max-w-[65%] break-all sm:max-w-none">{p.email || 'N/A'}</span>
                  </td>
                  <td className="flex items-start justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Source</span>
                    <span className="max-w-[65%] wrap-break-word sm:max-w-none">
                      {p.source || 'N/A'}
                    </span>
                  </td>
                  <td className="flex items-start justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Coupon Code</span>
                    <span className="max-w-[65%] break-all sm:max-w-none">
                      {p.couponCode || 'N/A'}
                    </span>
                  </td>
                  <td className="flex items-center justify-between gap-3 border-b border-gray-50 px-4 py-2.5 text-center text-gray-600 sm:table-cell sm:border-0 sm:px-6 sm:py-5">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">
                      T-Shirt Size
                    </span>
                    <span className="w-full max-w-[65%] text-center wrap-break-word sm:max-w-none">
                      {p.selectedTShirtSize || 'N/A'}
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
                      {p.age || 'N/A'}
                    </span>
                  </td>
                  <td className="flex items-start justify-between gap-3 px-4 py-2.5 text-right text-gray-600 sm:table-cell sm:px-6 sm:py-5 sm:text-left">
                    <span className="text-xs font-medium text-gray-400 sm:hidden">Gender</span>
                    <span className="max-w-[65%] wrap-break-word sm:max-w-none">
                      {p.gender || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ServerPagination meta={meta} onPageChange={(p) => setPage(Number(p) || 1)} />
    </div>
  );
};

export default ParticipantList;
