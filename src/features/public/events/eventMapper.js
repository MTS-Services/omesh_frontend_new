import { resolveImageUrl } from '../../../utils/images';

const STATUS_DISPLAY_MAP = {
  SUSPENDED: 'Registration Closed',
  'REGISTRATION CLOSED': 'Registration Closed',
  COMPLETED: 'Sold Out',
  'SOLD OUT': 'Sold Out',
};

const COUNTRY_FLAG_MAP = {
  bangladesh: 'bd',
  guyana: 'gy',
  'trinidad & tobago': 'tt',
  'trinidad and tobago': 'tt',
};

const normalizeString = (value) => String(value ?? '').trim();

const toNumberOr = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asNonEmptyArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === 'string' && item.trim());
};

const extractImageUrls = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === 'string') return resolveImageUrl(item);
      if (!item || typeof item !== 'object') return '';

      return resolveImageUrl(
        item.url || item.path || item.fileUrl || item.src || item.location || ''
      );
    })
    .filter(Boolean);
};

export const isValidEventId = (value) => {
  const id = normalizeString(value);
  return Boolean(id) && id !== 'undefined' && id !== 'null';
};

// const mapStatus = (status) => {
//   const key = normalizeString(status).toUpperCase();
//   return STATUS_DISPLAY_MAP[key] ?? null;
// };

const mapFlagCode = (country, incomingFlag) => {
  const normalizedFlag = normalizeString(incomingFlag).toLowerCase();
  if (normalizedFlag === 'bd' || normalizedFlag === 'gy' || normalizedFlag === 'tt') {
    return normalizedFlag;
  }

  const normalizedCountry = normalizeString(country).toLowerCase();
  if (!normalizedCountry) return '';

  if (COUNTRY_FLAG_MAP[normalizedCountry]) {
    return COUNTRY_FLAG_MAP[normalizedCountry];
  }

  if (normalizedCountry.includes('bangladesh')) return 'bd';
  if (normalizedCountry.includes('guyana')) return 'gy';
  if (normalizedCountry.includes('trinidad') || normalizedCountry.includes('tobago')) return 'tt';

  return '';
};

const formatStartAt = (startAt) => {
  if (!startAt) {
    return { date: '', time: '' };
  }

  const parsed = new Date(startAt);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '', time: '' };
  }

  const date = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);

  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(parsed);

  return { date, time };
};

const pickListPayload = (response) => {
  if (Array.isArray(response)) return response;

  const levelOne = response?.data ?? response;
  if (Array.isArray(levelOne)) return levelOne;
  if (Array.isArray(levelOne?.events)) return levelOne.events;
  if (Array.isArray(levelOne?.items)) return levelOne.items;
  if (Array.isArray(levelOne?.rows)) return levelOne.rows;
  if (Array.isArray(levelOne?.results)) return levelOne.results;
  if (Array.isArray(levelOne?.list)) return levelOne.list;
  if (Array.isArray(levelOne?.payload)) return levelOne.payload;
  if (Array.isArray(levelOne?.payload?.events)) return levelOne.payload.events;
  if (Array.isArray(levelOne?.payload?.items)) return levelOne.payload.items;
  if (Array.isArray(levelOne?.result)) return levelOne.result;
  if (Array.isArray(levelOne?.result?.events)) return levelOne.result.events;

  const levelTwo = levelOne?.data;
  if (Array.isArray(levelTwo)) return levelTwo;
  if (Array.isArray(levelTwo?.events)) return levelTwo.events;
  if (Array.isArray(levelTwo?.items)) return levelTwo.items;
  if (Array.isArray(levelTwo?.rows)) return levelTwo.rows;
  if (Array.isArray(levelTwo?.results)) return levelTwo.results;
  if (Array.isArray(levelTwo?.list)) return levelTwo.list;
  if (Array.isArray(levelTwo?.payload)) return levelTwo.payload;
  if (Array.isArray(levelTwo?.payload?.events)) return levelTwo.payload.events;
  if (Array.isArray(levelTwo?.payload?.items)) return levelTwo.payload.items;
  if (Array.isArray(levelTwo?.result)) return levelTwo.result;
  if (Array.isArray(levelTwo?.result?.events)) return levelTwo.result.events;

  if (levelOne && typeof levelOne === 'object' && levelOne.id) {
    return [levelOne];
  }

  if (levelTwo && typeof levelTwo === 'object' && levelTwo.id) {
    return [levelTwo];
  }

  return [];
};

const pickDetailPayload = (response) => {
  const levelOne = response?.data ?? response;
  if (Array.isArray(levelOne)) return levelOne[0] ?? null;
  if (levelOne && typeof levelOne === 'object' && levelOne.id) return levelOne;

  const levelTwo = levelOne?.data;
  if (Array.isArray(levelTwo)) return levelTwo[0] ?? null;
  if (levelTwo && typeof levelTwo === 'object') return levelTwo;

  return null;
};

export const mapPublicEvent = (rawEvent) => {
  if (!rawEvent || typeof rawEvent !== 'object') return null;
  const formattedFromStart = formatStartAt(rawEvent.startAt);
  const rawImages = extractImageUrls(rawEvent.images);
  const image = resolveImageUrl(rawEvent.coverImageUrl || rawEvent.image || rawImages[0]);
  const images = rawImages.length > 0 ? rawImages : image ? [image] : [];

  const seats = toNumberOr(rawEvent.availableSeats ?? rawEvent.seats, 0);
  const totalSeats = toNumberOr(rawEvent.totalSeats, seats);

  const organizerName = normalizeString(rawEvent.organizer?.fullName || rawEvent.organizer?.name);
  const organizerAvatar = normalizeString(
    rawEvent.organizer?.avatarUrl || rawEvent.organizer?.avatar
  );

  const country = normalizeString(rawEvent.country);
  const tShirtImageUrls = extractImageUrls(
    rawEvent.tShirtImageUrls ??
      rawEvent.tShirtImageUrl ??
      rawEvent.tshirtImageUrls ??
      rawEvent.tshirtImageUrl
  );
  const tShirtSizes = Array.isArray(rawEvent.tShirtSizes)
    ? rawEvent.tShirtSizes
        .filter(Boolean)
        .map((size) => normalizeString(size))
        .filter(Boolean)
    : normalizeString(rawEvent.tShirtSizes)
      ? normalizeString(rawEvent.tShirtSizes)
          .split(',')
          .map((size) => normalizeString(size))
          .filter(Boolean)
      : [];
  const tShirtPrice = toNumberOr(rawEvent.tShirtPrice ?? rawEvent.tshirtPrice, 0);

  return {
    id: normalizeString(rawEvent.id),
    title: normalizeString(rawEvent.title),
    image,
    images,
    date: formattedFromStart.date || normalizeString(rawEvent.date),
    time: formattedFromStart.time || normalizeString(rawEvent.time),
    location: normalizeString(rawEvent.location),
    distance: normalizeString(rawEvent.distance),
    country,
    flag: mapFlagCode(country, rawEvent.flag),
    price: toNumberOr(rawEvent.price, 0),
    currency: normalizeString(rawEvent.currency).toUpperCase(),
    seats,
    availableSeats: seats,
    totalSeats,
    status: rawEvent.status,
    registrationClosed: Boolean(rawEvent.registrationClosed ?? rawEvent.registerClose),
    registerClose: Boolean(rawEvent.registerClose ?? rawEvent.registrationClosed),
    description: {
      headline: normalizeString(rawEvent.headline),
      body: normalizeString(rawEvent.body),
      tagline: normalizeString(rawEvent.tagline),
      bullets1: asNonEmptyArray(rawEvent.bulletsTop ?? rawEvent.description?.bullets1),
      bullets2: asNonEmptyArray(rawEvent.bulletsBottom ?? rawEvent.description?.bullets2),
    },
    organizer: {
      name: organizerName,
      avatar: organizerAvatar,
    },
    tShirtIncluded: Boolean(rawEvent.tShirtIncluded ?? rawEvent.tshirtIncluded),
    tShirtImageUrls,
    tShirtImageUrl: tShirtImageUrls[0] ?? '',
    tShirtSizes,
    tShirtPrice,
  };
};

export const mapPublicEventsListResponse = (response) => {
  const list = pickListPayload(response);
  return list.map(mapPublicEvent).filter(Boolean);
};

export const mapPublicEventDetailsResponse = (response) => {
  const payload = pickDetailPayload(response);
  return mapPublicEvent(payload);
};
