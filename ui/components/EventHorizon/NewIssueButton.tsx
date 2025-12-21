import React from 'react'
import './NewIssueButton.css'

export interface NewIssueButtonProps {
  onClick?: () => void
}

export const NewIssueButton: React.FC<NewIssueButtonProps> = ({ onClick }) => {
  return (
    <button className="nih-button" onClick={onClick} aria-label="Create new issue">
      + New Issue
    </button>
  )
}

export default NewIssueButton
