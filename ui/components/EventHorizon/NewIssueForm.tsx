import React, { useState } from 'react'
import './NewIssueForm.css'

export interface NewIssueFormProps {
  open: boolean
  onClose: () => void
  onSubmit?: (payload: { title: string; body: string }) => void
}

export const NewIssueForm: React.FC<NewIssueFormProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  if (!open) return null

  return (
    <div className="nif-backdrop" role="dialog" aria-modal="true">
      <div className="nif-modal">
        <header className="nif-header">
          <h2 className="nif-title">Create new issue</h2>
          <button className="nif-close" onClick={onClose} aria-label="Close">×</button>
        </header>
        <section className="nif-body">
          <label className="nif-label">Title</label>
          <input className="nif-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="nif-label">Body</label>
          <textarea className="nif-textarea" value={body} onChange={(e) => setBody(e.target.value)} />
        </section>
        <footer className="nif-footer">
          <button className="nif-submit" onClick={() => { onSubmit?.({ title, body }); onClose() }}>Create</button>
        </footer>
      </div>
    </div>
  )
}

export default NewIssueForm
