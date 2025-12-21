import React from 'react'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div data-theme="blackhole">{children}</div>
}

export default ThemeProvider
