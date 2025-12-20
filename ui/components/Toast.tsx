"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: string; message: string; type?: 'info' | 'success' | 'error' };

const ToastContext = createContext<{ show: (m: string, t?: Toast['type']) => void } | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  // Return a safe no-op implementation if provider missing (useful in tests)
  if (!ctx) return { show: (_msg: string, _type?: any) => {} };
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    const t = { id, message, type };
    setToasts((s) => [...s, t]);
    setTimeout(() => setToasts((s) => s.filter(x => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {toasts.map(t => (
          <div key={t.id} role="status" aria-label={`toast-${t.type}`} className={`px-4 py-2 rounded shadow-lg text-sm ${t.type === 'error' ? 'bg-red-600 text-white' : t.type === 'success' ? 'bg-green-600 text-white' : 'bg-black/60 text-white'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
