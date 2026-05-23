const getFlagEmoji = (countryCode) => {
  if (!countryCode) return null;
  const code = String(countryCode).toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width="28"
      height="20"
      alt={countryCode}
      className=""
    />
  );
};

export default getFlagEmoji;
