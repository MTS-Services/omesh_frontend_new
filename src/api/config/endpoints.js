export const ENDPOINT = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
    PROFILE: '/api/v1/auth/profile',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    OTP_VERIFY: '/api/v1/auth/otp-verify',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    STATS: '/api/v1/auth/stats',
  },

  ADMIN: {
    STATS: '/api/v1/dashboard/admin-stats',
    SALES_COUNT: '/api/v1/dashboard/admin-sales-count',
    EVENTS: '/api/v1/events',
    TRAINING_PLANS: '/api/v1/training-plan-category',
    TRAINING_STRUCTURE: '/api/v1/training-plans',
    EVENT_BY_ID: (id) => `/api/v1/events/${id}`,
    EVENT_STATUS: (id) => `/api/v1/events/status/${id}`,
  },
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: '/api/v1/products?limit=5',
    CONTACT: '/api/v1/contact',

    EVENTS: {
      WEBSITE: '/api/v1/events/website',
     
      DETAILS_API: '/api/v1/events',

      REGISTRATION: '/api/v1/event-registration',
      REGISTRATION2: '/api/v1/event-registration/fygaro-payment',
    },
    PAYMENT: {
      CAPTURE: '/api/v1/payment/capture',
    },
     PLATFORM_SETTINGS: '/api/v1/platform-setting',
  },

  PRIVATE: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    BOOKED_EVENTS: '/api/v1/events/user/booked',
  },

  ORGANIZER: {
    STATS: '/api/v1/dashboard/organizer-stats',
    SALES_COUNT: '/api/v1/dashboard/organizer-sales-count',
    TOP_EVENT: '/api/v1/dashboard/organizer-top-event',
    PROMO: '/api/v1/promo',
    PROMO_BY_ID: (id) => `/api/v1/promo/${id}`,
    PROMO_APPLY: '/api/v1/promo/apply',
    EVENTS: {
      CREATE: '/api/v1/events',
      LIST: '/api/v1/events/organizer',
      DETAILS: '/api/v1/events',
      CLOSE: (id) => `/api/v1/events/close/${id}`,
    },
    PAYMENTS: {
      DATA: '/api/v1/payments',
      PAYOUTS_STATES: '/api/v1/pay-request/payouts-states',
    },
    UPLOAD: {
      MULTIPLE: '/api/v1/upload/multiple',
    },
  },


};
