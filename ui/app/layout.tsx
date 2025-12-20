import "./globals.css";
import type { ReactNode } from 'react';
export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="black-hole-container">
            <div className="accretion-disk"></div>
            <div className="singularity"></div>
        </div>
        {children}
      </body>
    </html>
  );
}