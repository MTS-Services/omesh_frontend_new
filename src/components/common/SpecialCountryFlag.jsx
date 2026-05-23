import React from 'react';
 
const SpecialCountryFlag = ({ name }) => {
  const countries = {
    'Trinidad & Tobago': '/img/random/trinidad_tobago_flag.png',
    Guyana: '/img/random/guyana_flag.png',
  };

  // console.log('Received country name:', name);
 
  const countryName = Object.keys(countries).find(
    (key) => key.toLowerCase() === name?.toLowerCase()
  );
 
  const flagUrl = countries[countryName];
 
  if (!flagUrl) {
    return <span className="text-xs text-red-400 italic">Country not in list</span>;
  }
 
  return (
    <div className="flex w-fit items-center gap-3 ">
      <img
        src={flagUrl}
        alt={countryName}
        className="h-[20px] w-[28px] object-cover"
      />
    </div>
  );
};
 
export default SpecialCountryFlag;