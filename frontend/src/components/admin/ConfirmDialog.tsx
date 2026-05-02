'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  type = 'danger'
}: ConfirmDialogProps) {
  const colorMap = {
    danger: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-yellow-500 text-black hover:bg-yellow-600',
    info: 'bg-blue-500 text-white hover:bg-blue-600',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h2>
            </div>

            <p className="text-gray-400 text-sm mb-8">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-grow py-3 px-4 rounded-xl bg-white/5 text-gray-300 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-grow py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${colorMap[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
