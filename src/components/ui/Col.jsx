const Col = ({ children, span, grow = false, style = {}, className = '' }) => {
  return (
    <div
      className={className}
      style={{
        flex: grow ? 1 : span ? `${span} 0 0` : '0 0 auto',
        width: span ? `${(span / 12) * 100}%` : 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Col;
