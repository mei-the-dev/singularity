import React from 'react'
import '../../src/storybook-theme.css'

const swatches = [
  { name: 'Background', var: '--color-bg' },
  { name: 'Surface', var: '--color-surface' },
  { name: 'Primary', var: '--color-primary' },
  { name: 'Accent', var: '--color-accent' },
  { name: 'Text', var: '--color-text' },
  { name: 'Muted', var: '--color-muted' },
]

export const Palette: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: 'var(--color-text)' }}>Theme Palette</h2>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        {swatches.map((s) => (
          <div key={s.var} style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: 8, background: `var(${s.var})`, border: '1px solid rgba(255,255,255,0.06)' }} />
            <div style={{ marginTop: 6, color: 'var(--color-text)', fontSize: 12 }}>{s.name}</div>
            <div style={{ color: 'var(--color-muted)', fontSize: 11 }}>{s.var}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Palette
