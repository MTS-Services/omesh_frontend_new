import { memo, forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Button Component - Accessible, reusable button following WCAG guidelines
 *
 * Features:
 * - Full keyboard support
 * - ARIA attributes for screen readers
 * - Loading states with accessible loading indicator
 * - Multiple variants and sizes
 * - Proper focus management
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 */

const Button = memo(
  forwardRef(
    (
      {
        children,
        variant = 'primary',
        size = 'md',
        disabled = false,
        loading = false,
        type = 'button',
        fullWidth = false,
        leftIcon,
        rightIcon,
        className,
        'aria-label': ariaLabel,
        onClick,
        ...rest
      },
      ref
    ) => {
      const baseStyles =
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

      const variants = {
        primary:
          'bg-gradient-to-r from-blue-500 to-purple-200 text-white hover:shadow-lg focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        outline:
          'ring ring-gray-100 bg-transparent hover:bg-gray-50 hover:text-gray-700 bg-blue-600 font-semibold text-gray-700',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      };

      const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
        md: 'px-6 py-2.5 text-base rounded-lg gap-2',
        lg: 'px-8 py-3 text-lg rounded-lg gap-2.5',
      };

      const buttonClasses = clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'pointer-events-none',
        className
      );

      // Ensure accessible label when only icons are present
      const hasOnlyIcons = !children && (leftIcon || rightIcon);
      const accessibleLabel = ariaLabel || (hasOnlyIcons ? 'Button' : undefined);

      return (
        <button
          ref={ref}
          type={type}
          disabled={disabled || loading}
          className={buttonClasses}
          aria-label={accessibleLabel}
          aria-busy={loading}
          aria-disabled={disabled || loading}
          onClick={onClick}
          {...rest}
        >
          {loading && (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              role="status"
              aria-label="Loading"
            />
          )}
          {!loading && leftIcon && (
            <span className="inline-flex" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          {children && <span>{children}</span>}
          {!loading && rightIcon && (
            <span className="inline-flex" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';

export default Button;
