/**
 * Shared country list for event create, filters, and flag display.
 * `code` is ISO 3166-1 alpha-2 (used by flagcdn.com).
 */
export const EVENT_COUNTRIES = [
  {
    label: 'Trinidad & Tobago',
    code: 'tt',
    aliases: ['trinidad and tobago', 'trinidad & tobago', 'trinidad'],
  },
  {
    label: 'Guyana',
    code: 'gy',
    aliases: ['guyana'],
  },
  {
    label: 'Barbados',
    code: 'bb',
    aliases: ['barbados'],
  },
  {
    label: 'Dominica',
    code: 'dm',
    aliases: ['dominica'],
  },
  {
    label: 'Jamaica',
    code: 'jm',
    aliases: ['jamaica'],
  },
  {
    label: 'St Lucia',
    code: 'lc',
    aliases: ['st lucia', 'st. lucia', 'saint lucia'],
  },
  {
    label: 'Grenada',
    code: 'gd',
    aliases: ['grenada'],
  },
  {
    label: 'USA',
    code: 'us',
    aliases: ['usa', 'united states', 'united states of america', 'u.s.a.', 'u.s.'],
  },
];

const byCode = Object.fromEntries(EVENT_COUNTRIES.map((c) => [c.code, c]));

/** Map normalized country name / alias → ISO code */
export const COUNTRY_NAME_TO_CODE = EVENT_COUNTRIES.reduce((acc, country) => {
  acc[country.label.toLowerCase()] = country.code;
  for (const alias of country.aliases) {
    acc[alias.toLowerCase()] = country.code;
  }
  return acc;
}, {});

/** Map ISO code → display label */
export const COUNTRY_CODE_TO_LABEL = Object.fromEntries(
  EVENT_COUNTRIES.map((c) => [c.code, c.label])
);

/**
 * Resolve any country string (name, alias, or ISO code) to an ISO code.
 */
export const resolveCountryCode = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';

  if (byCode[raw]) return raw;
  if (COUNTRY_NAME_TO_CODE[raw]) return COUNTRY_NAME_TO_CODE[raw];

  // Prefer longer aliases first so "dominican republic" won't match "dominica"
  const aliasHits = EVENT_COUNTRIES.flatMap((country) =>
    [...country.aliases, country.label.toLowerCase()].map((alias) => ({
      code: country.code,
      alias,
    }))
  ).sort((a, b) => b.alias.length - a.alias.length);

  for (const { code, alias } of aliasHits) {
    if (raw === alias) return code;
    // Whole-word / boundary-ish match for multi-word locations
    const pattern = new RegExp(`(^|[\\s,])${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[\\s,])`, 'i');
    if (pattern.test(` ${raw} `)) return code;
  }

  return '';
};

export const getCountryLabel = (value) => {
  const code = resolveCountryCode(value);
  if (code && COUNTRY_CODE_TO_LABEL[code]) return COUNTRY_CODE_TO_LABEL[code];
  return String(value || '').trim();
};
