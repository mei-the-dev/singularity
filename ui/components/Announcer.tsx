import React, { createContext, useContext, useRef } from 'react';

const AnnouncerContext = createContext<{ announce: (msg: string) => void } | null>(null);

export const AnnouncerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const announce = (msg: string) => {
    if (!ref.current) return;
    ref.current.textContent = '';
    // small delay to ensure SR picks up repeated announcements
    setTimeout(() => { ref.current && (ref.current.textContent = msg); }, 100);
  };
  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }} ref={ref} />
    </AnnouncerContext.Provider>
  );
};

export const useAnnouncer = () => {
  const ctx = useContext(AnnouncerContext);
  if (!ctx) throw new Error('useAnnouncer must be used inside AnnouncerProvider');
  return ctx;
};

export default AnnouncerProvider;