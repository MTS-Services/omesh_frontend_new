// import React from 'react';

// const SpecialCountryFlag = ({ name }) => {


//   console.log('Received country name:', name);

//   const countries = {
//     'Trinidad & Tobago': '/flags/trinidad.png',
//     Guyana: '/flags/guyana.png',
//   };

//   const countryName = Object.keys(countries).find(
//     (key) => key.toLowerCase() === name?.toLowerCase()
//   );

//   const flagUrl = countries[countryName];

//   console.log('Resolved country name:==============', flagUrl);

//   if (!flagUrl) {
//     return <span className="text-xs text-red-400 italic">Country not in list</span>;
//   }

//   return (
//     <div className="flex w-fit items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
//       <img
//         src={flagUrl}
//         alt={countryName}
//         className="h-7 w-10 rounded border border-gray-100 object-cover"
//       />
//     </div>
//   );
// };

// export default SpecialCountryFlag;
