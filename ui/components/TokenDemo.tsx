import React from 'react';

const Swatch = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
    <div style={{ width: 56, height: 36, borderRadius: 6, background: `var(${value})`, border: '1px solid rgba(255,255,255,0.06)' }} />
    <div style={{ color: 'var(--muted)', fontSize: 12 }}>
      <div style={{ color: '#fff', fontSize: 13 }}>{label}</div>
      <div style={{ color: 'var(--muted)' }}><code>{value}</code></div>
    </div>
  </div>
);

export const TokenDemo = () => (
  <div style={{ padding: 12 }}>
    <h3 style={{ margin: 0, marginBottom: 8 }}>Design Tokens</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      <Swatch label="Background" value="--bg" />
      <Swatch label="Panel" value="--panel" />
      <Swatch label="Gold" value="--gold" />
      <Swatch label="Gold (dim)" value="--gold-dim" />
      <Swatch label="Accent" value="--accent" />
      <Swatch label="Muted" value="--muted" />
    </div>
  </div>
);

export default TokenDemo;
