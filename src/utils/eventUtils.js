import { COUNTRY_CODE_TO_LABEL, getCountryLabel } from '../constants/countries';

/**
 * Filter events by status/tab
 * @param {Array} events - Array of event objects
 * @param {string} activeTab - Current active tab key
 * @returns {Array} Filtered events
 */
export const filterEventsByTab = (events, activeTab) => {
  if (activeTab === 'all') {
    return events;
  }

  const normalizeStatus = (value) => {
    const key = String(value || '').trim().toLowerCase();
    if (key === 'canceled' || key === 'cancel') return 'cancelled';
    return key;
  };

  const tabKey = normalizeStatus(activeTab);
  return events.filter((event) => normalizeStatus(event.status) === tabKey);
};

/**
 * Calculate progress percentage for event seats
 * @param {number} availableSeats - Number of available seats
 * @param {number} totalSeats - Total number of seats
 * @returns {number} Progress percentage
 */
export const calculateSeatProgress = (availableSeats, totalSeats) => {
  if (totalSeats === 0) return 0;
  return Math.round(((totalSeats - availableSeats) / totalSeats) * 100);
};

/**
 * Format event type / legacy distance for display.
 * Shows the organizer-entered value as-is (e.g. Running, 5km Trail).
 */
export const formatDistanceValue = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw || raw === '-') return '-';
  return raw;
};

const COUNTRY_CODE_MAP = {
  it: 'Italy',
  nl: 'Netherlands',
  gb: 'United Kingdom',
  ca: 'Canada',
  de: 'Germany',
  fr: 'France',
  es: 'Spain',
  pt: 'Portugal',
  in: 'India',
  au: 'Australia',
  jp: 'Japan',
  ...COUNTRY_CODE_TO_LABEL,
};

const CITY_COUNTRY_MAP = {
  rome: 'Italy',
  milan: 'Italy',
  venice: 'Italy',
  florence: 'Italy',
  naples: 'Italy',
  turin: 'Italy',
  bologna: 'Italy',
  genoa: 'Italy',
  verona: 'Italy',
  pisa: 'Italy',
  amsterdam: 'Netherlands',
};

const normalizeCountryName = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const fromEventList = getCountryLabel(raw);
  if (fromEventList && fromEventList !== raw) return fromEventList;

  const byCode = COUNTRY_CODE_MAP[raw.toLowerCase()];
  return byCode || raw;
};

const inferCountryFromLocation = (location) => {
  const raw = String(location || '').trim();
  if (!raw) return '';

  const parts = raw.split(',').map((part) => part.trim()).filter(Boolean);
  const lastPart = parts.length > 1 ? parts[parts.length - 1] : '';
  if (lastPart && /[a-z]/i.test(lastPart) && !/\d/.test(lastPart)) {
    return normalizeCountryName(lastPart);
  }

  const lowered = raw.toLowerCase();
  for (const city in CITY_COUNTRY_MAP) {
    if (lowered.includes(city)) return CITY_COUNTRY_MAP[city];
  }

  return '';
};

export const formatLocationWithCountry = (location, country) => {
  const rawLocation = String(location ?? '').trim();
  if (!rawLocation || rawLocation === '-') return '-';

  const countryName = normalizeCountryName(country) || inferCountryFromLocation(rawLocation);
  if (!countryName) return rawLocation;

  if (rawLocation.toLowerCase().includes(countryName.toLowerCase())) {
    return rawLocation;
  }

  return `${rawLocation}, ${countryName}`;
};
