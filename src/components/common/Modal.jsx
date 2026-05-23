import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

/**
 * Reusable Modal Component
 *
 * @param {boolean} open - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {string} title - Modal header title (optional)
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full' or custom class
 * @param {boolean} showCloseButton - Show X button in header (default: true)
 * @param {boolean} closeOnOverlay - Close on overlay click (default: true)
 * @param {boolean} closeOnEscape - Close on Escape key (default: true)
 * @param {string} className - Additional classes for modal container
 * @param {ReactNode} footer - Optional footer content
 */
const Modal = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  className = '',
  footer,
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle content click (prevent closing when clicking inside modal)
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!open) return null;

  // Determine size class
  const sizeClass = SIZE_CLASSES[size] || size;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClass} max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl ${className}`}
        onClick={handleContentClick}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && <div className="border-t border-gray-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
