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
      {/* Backdrop with warm diffused tint */}
      <div
        className="fixed inset-0 bg-[#231F20]/35 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Sheet / Dialog Modal with iOS 28px corners, delicate sand border, and diffused warm shadow */}
      <div
        className={`relative w-full ${maxWidth} bg-white/95 backdrop-blur-2xl rounded-[28px] border border-[#E8E0D5] p-6 md:p-7 z-10 transform transition-all duration-200 scale-100 animate-in fade-in zoom-in-95`}
        style={{
          boxShadow: '0 20px 40px -15px rgba(60, 45, 30, 0.15)',
        }}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#E8E0D5]">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#231F20]">{title}</h3>
            {subtitle && <p className="text-xs text-[#7A7267] mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#F5F0E6] text-[#7A7267] hover:text-[#231F20] hover:bg-[#EFEAE1] transition-colors ios-press-action"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
