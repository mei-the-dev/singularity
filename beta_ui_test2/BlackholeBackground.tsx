import React from 'react';

interface BlackholeBackgroundProps {
  mousePosition: { x: number; y: number };
}

const BlackholeBackground: React.FC<BlackholeBackgroundProps> = ({ mousePosition }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" data-testid="blackhole-background">
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black to-black"></div>

      {/* Central Blackhole */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
        style={{
          transform: `translate(-50%, -50%) translate(${(mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 0) / 2) / 50}px, ${(mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 0) / 2) / 50}px)`
        }}
      >
        <div className="absolute inset-0 rounded-full bg-black blur-xl animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-900/40 via-amber-700/30 to-transparent animate-spin-slow"></div>
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-800/50 via-amber-600/40 to-transparent animate-spin-slower"></div>
        <div className="absolute inset-12 rounded-full bg-gradient-to-br from-amber-700/60 via-amber-500/50 to-transparent animate-spin-reverse"></div>
        <div className="absolute inset-16 rounded-full bg-black shadow-2xl"></div>
      </div>

      {/* Orbiting Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-amber-400 rounded-full animate-orbit"
          style={{
            left: '50%',
            top: '50%',
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${10 + i}s`,
            opacity: Math.random() * 0.7 + 0.3
          }}
        ></div>
      ))}
    </div>
  );
};

export default BlackholeBackground;