const Row = ({
  children,
  gap = 16,
  align = 'stretch',
  justify = 'flex-start',
  wrap = true,
  style = {},
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Row;
