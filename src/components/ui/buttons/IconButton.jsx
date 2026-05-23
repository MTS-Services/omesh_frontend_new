import { memo, forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * IconButton Component - Accessible icon-only button
 *
 * IMPORTANT: Always provide an aria-label for accessibility
 * Lighthouse Audit Requirement: Icon-only buttons MUST have accessible names
 *
 * @example
 * <IconButton
 *   icon={<Menu size={20} />}
 *   aria-label="Open navigation menu"
 *   onClick={handleMenuClick}
 * />
 */

const IconButton = memo(
  forwardRef(
    (
      {
        icon,
        variant = 'ghost',
        size = 'md',
        disabled = false,
        loading = false,
        type = 'button',
        className,
        'aria-label': ariaLabel, // REQUIRED for accessibility
        onClick,
        ...rest
      },
      ref
    ) => {
      // Log warning in development if aria-label is missing
      if (import.meta.env.DEV && !ariaLabel) {
        console.warn(
          'IconButton: Missing aria-label. Icon-only buttons must have accessible names for screen readers.'
        );
      }

      const baseStyles =
        'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

      const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      };

      const sizes = {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
      };

      const buttonClasses = clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'pointer-events-none',
        className
      );

      return (
        <button
          ref={ref}
          type={type}
          disabled={disabled || loading}
          className={buttonClasses}
          aria-label={ariaLabel || 'Icon button'} // Fallback, but warn in dev
          aria-busy={loading}
          aria-disabled={disabled || loading}
          onClick={onClick}
          {...rest}
        >
          {loading ? (
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
              role="status"
              aria-label="Loading"
            />
          ) : (
            <span aria-hidden="true">{icon}</span>
          )}
        </button>
      );
    }
  )
);

IconButton.displayName = 'IconButton';

export default IconButton;
