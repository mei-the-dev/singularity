import { useCallback, useEffect, useRef, useState } from 'react'

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string | null
  state: string
  user: { login: string; avatar_url?: string }
  comments: number
  url: string
}

export default function useGitHubIssues(owner: string, repo: string, token?: string) {
  const [issues, setIssues] = useState<GitHubIssue[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchIssues = useCallback(async () => {
    setLoading(true)
    setError(null)
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    try {
      const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
      const tokenToUse =
        token ??
        (typeof process !== 'undefined' ? (process.env.GITHUB_TOKEN as string | undefined) : undefined) ??
        (typeof window !== 'undefined' ? (window as any).__SINGULARITY_GITHUB_TOKEN : undefined)
      if (tokenToUse) headers.Authorization = `token ${tokenToUse}`

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100`,
        { method: 'GET', headers, signal: ac.signal }
      )
      if (!res.ok) throw new Error(`GitHub API error ${res.status}`)
      const data = await res.json()
      const mapped = (data as any[]).map((i) => ({
        id: i.id,
        number: i.number,
        title: i.title,
        body: i.body,
        state: i.state,
        user: i.user ? { login: i.user.login, avatar_url: i.user.avatar_url } : { login: 'unknown' },
        comments: i.comments ?? 0,
        url: i.html_url ?? i.url,
      }))
      setIssues(mapped)
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [owner, repo, token])

  useEffect(() => {
    fetchIssues()
    return () => abortRef.current?.abort()
  }, [fetchIssues])

  return { issues, loading, error, refresh: fetchIssues }
}
