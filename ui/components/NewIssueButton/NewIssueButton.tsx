import React from 'react';
import { Plus } from 'lucide-react';

export interface NewIssueButtonProps { onClick?: () => void; label?: string }

export const NewIssueButton: React.FC<NewIssueButtonProps> = ({ onClick, label='New Issue' }) => (
  <button
    onClick={onClick}
    className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-amber-900/50 hover:shadow-amber-800/70 hover:scale-105"
    data-testid="new-issue-button"
  >
    <Plus className="w-4 h-4" />
    <span className="text-sm font-medium text-black">{label}</span>
  </button>
)

export default NewIssueButton;
