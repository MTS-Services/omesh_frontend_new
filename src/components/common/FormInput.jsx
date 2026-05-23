import React from 'react';

/**
 * FormInput Component
 * Reusable form input with validation styling
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  icon = null,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-700 transition-colors focus:ring-2 focus:outline-none ${
            icon ? 'pr-12' : ''
          } ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
          }`}
        />
        {icon && <div className="absolute top-1/2 right-4 -translate-y-1/2">{icon}</div>}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
