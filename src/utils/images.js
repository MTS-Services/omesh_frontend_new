import { API_CONFIG } from '../api/config/constants';

export const resolveImageUrl = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  const lowered = raw.toLowerCase();
  if (lowered === 'null' || lowered === 'undefined' || lowered === '[object object]') {
    return '';
  }

  if (raw.startsWith('#')) return '';

  // Already a complete URL
  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) {
    return raw;
  }


  if (raw.startsWith(':')) {
    return `${API_CONFIG.BASE_URL}${raw.substring(raw.indexOf('/'))}`;
  }

  // Handle relative paths
  return `${API_CONFIG.BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
};