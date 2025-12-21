import React from 'react';
import './AutoFlowButton.css';

export default function AutoFlowButton({ label = 'Auto' }: { label?: string }) {
  return (
    <button className="auto-flow-button" aria-label="autoflow">
      {label}
    </button>
  );
}
