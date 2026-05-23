import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';

const resolvedPathCache = new Map();

const normalizePath = (path) => path.replace(/\/+/g, '/').replace(/\/$/, '');

const buildPathCandidates = (path) => {
  const normalized = normalizePath(path);
  const isApiV1 = normalized.startsWith('/api/v1/');
  const withoutApiV1 = isApiV1 ? normalized.replace('/api/v1', '') : normalized;

  const candidates = [normalized, withoutApiV1, `/api/v1${withoutApiV1}`];

  if (withoutApiV1.startsWith('/dashboard/')) {
    const organizerPath = `/organizer${withoutApiV1}`;
    candidates.push(organizerPath, `/api/v1${organizerPath}`);
  }

  if (withoutApiV1.startsWith('/organizer/dashboard/')) {
    const noOrganizer = withoutApiV1.replace('/organizer', '');
    candidates.push(noOrganizer, `/api/v1${noOrganizer}`);
  }

  return [...new Set(candidates.map(normalizePath))];
};

const requestWithPathFallback = async ({ method, url, params, signal }) => {
  const cacheKey = `${method}:${url}`;
  const cachedPath = resolvedPathCache.get(cacheKey);
  const candidates = cachedPath
    ? [cachedPath, ...buildPathCandidates(url).filter((candidate) => candidate !== cachedPath)]
    : buildPathCandidates(url);

  for (let i = 0; i < candidates.length; i += 1) {
    try {
      const response = await request({
        method,
        url: candidates[i],
        params,
        signal,
      });

      resolvedPathCache.set(cacheKey, candidates[i]);
      return response;
    } catch (error) {
      const status = error?.response?.status || error?.status;
      const isNotFound = status === 404;
      const isLastCandidate = i === candidates.length - 1;

      if (!isNotFound || isLastCandidate) {
        throw error;
      }
    }
  }

  return null;
};

// API Integration: Organizer dashboard stats
export const fetchOrganizerStatsService = async ({ signal } = {}) => {
  return await requestWithPathFallback({
    method: 'GET',
    url: ENDPOINT.ORGANIZER.STATS,
    signal,
  });
};

export const fetchOrganizerSalesCountService = async (range, { signal } = {}) => {
  return await requestWithPathFallback({
    method: 'GET',
    url: ENDPOINT.ORGANIZER.SALES_COUNT,
    params: { range },
    signal,
  });
};

export const fetchOrganizerTopEventService = async (range, { signal } = {}) => {
  return await requestWithPathFallback({
    method: 'GET',
    url: ENDPOINT.ORGANIZER.TOP_EVENT,
    params: { range },
    signal,
  });
};
