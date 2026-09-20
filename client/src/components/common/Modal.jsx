import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              {title && <h3 className="text-xl font-bold text-slate-900">{title}</h3>}
              {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
