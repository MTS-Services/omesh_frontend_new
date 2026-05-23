// Set cookie with security options
export const setCookie = (name, value, days, options = {}) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }

  // Default options for security
  const {
    path = '/',
    secure = window.location.protocol === 'https:',
    sameSite = 'Strict', // 'Strict', 'Lax', or 'None'
  } = options;

  let cookieString = `${name}=${value || ''}${expires}; path=${path}`;

  // Add SameSite attribute
  if (sameSite) {
    cookieString += `; SameSite=${sameSite}`;
  }

  // Add Secure flag (only for HTTPS)
  if (secure) {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
};

// Get cookie
export const getCookie = (name) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Remove cookie
export const removeCookie = (name, options = {}) => {
  const { path = '/' } = options;
  document.cookie = `${name}=; Max-Age=-99999999; path=${path}`;
};

// Check if cookie exists
export const checkCookie = (name) => {
  const cookie = getCookie(name);
  return cookie !== null;
};
