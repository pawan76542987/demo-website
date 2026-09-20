import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
            isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm text-white transition shadow-sm ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 focus:ring-2 focus:ring-rose-500'
                : 'bg-brand-600 hover:bg-brand-700 focus:ring-2 focus:ring-brand-500'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
