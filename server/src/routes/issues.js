import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()

// In-memory store (simple for dev)
const issues = [
  { id: 1, number: 101, title: 'Sample issue', body: 'Scaffold backend', state: 'open', user: { login: 'dev' }, comments: 0, url: '#' }
]

router.get('/', (req, res) => {
  res.json({ data: issues })
})

router.get('/:number', (req, res) => {
  const num = Number(req.params.number)
  const i = issues.find((it) => it.number === num)
  if (!i) return res.status(404).json({ error: 'Not found' })
  res.json({ data: i })
})

router.post('/', (req, res) => {
  const body = req.body || {}
  const nextId = issues.length ? Math.max(...issues.map((i) => i.id)) + 1 : 1
  const nextNumber = issues.length ? Math.max(...issues.map((i) => i.number)) + 1 : 100
  const newIssue = {
    id: nextId,
    number: nextNumber,
    title: body.title || 'Untitled',
    body: body.body || null,
    state: 'open',
    user: body.user || { login: 'dev' },
    comments: 0,
    url: '#',
  }
  issues.push(newIssue)
  res.status(201).json({ data: newIssue })
})

// Proxy to GitHub issues (optional). Uses server-side token from environment.
router.get('/github/proxy', async (req, res) => {
  const owner = req.query.owner || process.env.GITHUB_OWNER
  const repo = req.query.repo || process.env.GITHUB_REPO
  if (!owner || !repo) return res.status(400).json({ error: 'owner and repo required' })
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100`
    const headers = { Accept: 'application/vnd.github.v3+json' }
    if (process.env.GITHUB_TOKEN) headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
    const r = await fetch(url, { headers })
    const data = await r.json()
    return res.json({ data })
  } catch (err) {
    return res.status(500).json({ error: 'GitHub proxy failed', details: String(err) })
  }
})

export default router
