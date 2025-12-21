import express from 'express'

const router = express.Router()

// Return mocked MCP tools list
router.get('/tools', (req, res) => {
  const tools = [
    { name: 'check_storybook_status', category: 'Storybook', status: 'ready' },
    { name: 'generate_baselines', category: 'Testing', status: 'ready' },
    { name: 'scaffold_component', category: 'Components', status: 'ready' },
  ]
  res.json({ data: tools })
})

// Return mocked service health
router.get('/status', (req, res) => {
  const services = [
    { name: 'storybook', port: 6006, status: 'running', health: 'healthy', url: 'http://localhost:6006' },
    { name: 'ui', port: 3000, status: 'running', health: 'healthy', url: 'http://localhost:3000' },
  ]
  res.json({ data: { services } })
})

export default router
