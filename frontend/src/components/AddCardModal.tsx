'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddCardModalProps {
  isOpen: boolean;
  columnTitle: string;
  onClose: () => void;
  onSubmit: (title: string, details: string) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  columnTitle,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), details.trim());
    setTitle('');
    setDetails('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDetails('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3
            id="modal-title"
            className="text-base font-semibold text-[#032147]"
          >
            Add Card to {columnTitle}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label
              htmlFor="card-title-input"
              className="block text-xs font-semibold uppercase tracking-wider text-[#888888] mb-1.5"
            >
              Card Title
            </label>
            <input
              id="card-title-input"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Update documentation"
              required
              className="w-full px-3 py-2 text-sm text-[#032147] bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#209dd7] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="card-details-input"
              className="block text-xs font-semibold uppercase tracking-wider text-[#888888] mb-1.5"
            >
              Card Details
            </label>
            <textarea
              id="card-details-input"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter additional details for this task..."
              className="w-full px-3 py-2 text-sm text-[#032147] bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#209dd7] focus:bg-white resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-[#888888] hover:text-[#032147] hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="submit-card-button"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#753991] hover:bg-[#602d77] rounded-lg shadow-xs hover:shadow transition-all"
            >
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
