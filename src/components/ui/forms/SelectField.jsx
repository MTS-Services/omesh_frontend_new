import { memo, forwardRef, useId, useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * SelectField Component - Accessible dropdown select
 *
 * Features:
 * - Native select with custom styling
 * - Proper ARIA attributes
 * - Error state handling
 * - Placeholder option with disabled state
 * - Required field support
 *
 * @example
 * <SelectField
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' }
 *   ]}
 *   required
 * />
 */

const SelectField = memo(
  forwardRef(
    (
      {
        label,
        options = [],
        placeholder = 'Select an option',
        error,
        helperText,
        required = false,
        disabled = false,
        fullWidth = false,
        className,
        id: providedId,
        'aria-label': ariaLabel,
        onFocus,
        onBlur,
        onChange,
        ...rest
      },
      ref
    ) => {
      const [isExpanded, setIsExpanded] = useState(false);
      const autoId = useId();
      const id = providedId || autoId;
      const errorId = `${id}-error`;
      const helperId = `${id}-helper`;

      const describedBy =
        [error ? errorId : null, helperText ? helperId : null].filter(Boolean).join(' ') ||
        undefined;

      const selectClasses = clsx(
        'w-full rounded-lg border px-4 py-2.5 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none bg-white',
        'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
        'pr-10',
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
        className
      );

      const labelClasses = clsx(
        'mb-1.5 block text-sm font-medium text-gray-700',
        disabled && 'text-gray-500',
        required && "after:ml-0.5 after:text-red-500 after:content-['*']"
      );

      const containerClasses = clsx(fullWidth ? 'w-full' : 'w-auto');

      return (
        <div className={containerClasses}>
          {label && (
            <label htmlFor={id} className={labelClasses}>
              {label}
            </label>
          )}

          <div className="relative">
            <select
              ref={ref}
              id={id}
              className={selectClasses}
              disabled={disabled}
              required={required}
              aria-label={ariaLabel || (label ? undefined : 'Select field')}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={describedBy}
              aria-required={required}
              onFocus={(event) => {
                setIsExpanded(true);
                onFocus?.(event);
              }}
              onBlur={(event) => {
                setIsExpanded(false);
                onBlur?.(event);
              }}
              onChange={(event) => {
                setIsExpanded(false);
                onChange?.(event);
              }}
              {...rest}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {error && (
            <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {helperText && !error && (
            <p id={helperId} className="mt-1.5 text-sm text-gray-600">
              {helperText}
            </p>
          )}
        </div>
      );
    }
  )
);

SelectField.displayName = 'SelectField';

export default SelectField;
