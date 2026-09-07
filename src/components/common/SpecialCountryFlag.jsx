import React from 'react';
import { resolveCountryCode, getCountryLabel } from '../../constants/countries';

/**
 * Renders a country flag from a country name or ISO code.
 * Uses flagcdn.com (same source as FlagIcon) so new countries need no local assets.
 */
const SpecialCountryFlag = ({ name }) => {
  const code = resolveCountryCode(name);
  const label = getCountryLabel(name) || name;

  if (!code) {
    return <span className="text-xs text-red-400 italic">Country not in list</span>;
  }

  return (
    <div className="flex w-fit items-center gap-3">
      <img
        src={`https://flagcdn.com/w40/${code}.png`}
        srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
        width="28"
        height="20"
        alt={label}
        className="h-[20px] w-[28px] object-cover"
      />
    </div>
  );
};

export default SpecialCountryFlag;
