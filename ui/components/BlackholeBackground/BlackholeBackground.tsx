import React from 'react';

export interface BlackholeBackgroundProps { className?: string }

export const BlackholeBackground: React.FC<BlackholeBackgroundProps> = ({ className='' }) => {
  // Purely presentational: uses CSS variables for parallax offsets set on a parent container
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none h-screen ${className}`} data-testid="blackhole-bg">
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black to-black" />

      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
        style={{
          transform: 'translate(-50%, -50%) translate(calc((var(--mouse-x, 50vw) - 50vw)/50), calc((var(--mouse-y, 50vh) - 50vh)/50))'
        }}
      >
        <div className="absolute inset-0 rounded-full bg-black blur-xl animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-900/40 via-amber-700/30 to-transparent animate-spin-slow" />
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-800/50 via-amber-600/40 to-transparent animate-spin-slower" />
        <div className="absolute inset-12 rounded-full bg-gradient-to-br from-amber-700/60 via-amber-500/50 to-transparent animate-spin-reverse" />
        <div className="absolute inset-16 rounded-full bg-black shadow-2xl" />
      </div>

      {[...Array(30)].map((_, i) => {
        const opacity = 0.3 + (i / 29) * 0.7; // deterministic opacity across runs
        return (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full animate-orbit"
            style={{
              left: '50%',
              top: '50%',
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${10 + i}s`,
              opacity,
              transformOrigin: 'center'
            }}
          />
        )
      })}
    </div>
  );
};

export default BlackholeBackground;
