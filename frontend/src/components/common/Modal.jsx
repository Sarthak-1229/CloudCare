import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#18181B]/40 backdrop-blur-xs transition-opacity duration-150"
        onClick={onClose}
      />

      {/* Luxury Minimalist Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl sm:rounded-[24px] border border-[rgba(28,25,23,0.08)] p-6 sm:p-8 z-10 transform transition-all duration-150 scale-100 animate-in fade-in zoom-in-95`}
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 24px 48px -12px rgba(28, 25, 23, 0.12)',
        }}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#ECE9E2]">
          <div>
            <h3 className="text-xl font-bold tracking-[-0.02em] text-[#18181B]">{title}</h3>
            {subtitle && <p className="text-xs text-[#6E6A63] mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#F3F1ED] text-[#6E6A63] hover:text-[#18181B] hover:bg-[#ECE9E2] transition-colors btn-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
