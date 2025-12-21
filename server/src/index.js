import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import issuesRouter from './routes/issues.js'
import mcpRouter from './routes/mcp.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/issues', issuesRouter)
app.use('/api/mcp', mcpRouter)

app.get('/', (req, res) => res.json({ ok: true, service: 'singularity-backend' }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Singularity backend listening on http://localhost:${PORT}`)
})
