import React from 'react'
import './ColumnHeader.css'

export interface ColumnHeaderProps {
  title: string
  count?: number
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, count = 0 }) => {
  return (
    <div className="col-header">
      <h4 className="col-header__title">{title}</h4>
      <div className="col-header__count">{count}</div>
    </div>
  )
}

export default ColumnHeader
