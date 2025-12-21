import React from 'react'

export interface ColumnHeaderProps { title: string; count?: number }

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, count = 0 }) => (
  <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-900/30 rounded-t-xl px-4 py-3 backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-amber-100">{title}</h3>
      <span className="text-xs text-amber-600 bg-amber-950/50 px-2 py-1 rounded-full">{count}</span>
    </div>
  </div>
)

export default ColumnHeader
