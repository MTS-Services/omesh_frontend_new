const Button = ({ children, onClick, className, type = 'button' }) => {
  return (
    <button type={type} onClick={onClick} className={`rounded px-4 py-2 ${className}`}>
      {children}
    </button>
  );
};

export default Button;
