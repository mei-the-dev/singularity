// GitHub API integration for fetching issues

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  assignee: {
    login: string;
  } | null;
  labels: Array<{
    name: string;
  }>;
  body?: string;
  html_url: string;
}

export interface MappedIssue {
  id: number;
  title: string;
  status: string;
  assignee: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  points: number;
  type: 'bug' | 'feature' | 'enhancement' | 'design' | 'docs' | 'test' | 'infrastructure';
  url: string;
  body?: string;
}

const REPO_OWNER = process.env.REACT_APP_GITHUB_REPO_OWNER || 'octocat';
const REPO_NAME = process.env.REACT_APP_GITHUB_REPO_NAME || 'Hello-World';

const API_BASE = 'https://api.github.com';

// Get GitHub token - prioritizes environment variable for browser compatibility
async function getGitHubToken(): Promise<string> {
  // Primary: Environment variable (works in browser)
  const envToken = process.env.REACT_APP_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  if (envToken) {
    return envToken;
  }

  // Note: GitHub CLI auth would require server-side execution
  // For now, we rely on environment variables in the browser
  throw new Error('GitHub token not found. Please set REACT_APP_GITHUB_TOKEN or GITHUB_TOKEN environment variable. You can get a token from: https://github.com/settings/tokens');
}

export async function fetchGitHubIssues(): Promise<MappedIssue[]> {
  const token = await getGitHubToken();

  const url = `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const issues: GitHubIssue[] = await response.json();

    return issues.map(mapGitHubIssueToIssue);
  } catch (error) {
    console.error('Error fetching GitHub issues:', error);
    throw error;
  }
}

function mapGitHubIssueToIssue(ghIssue: GitHubIssue): MappedIssue {
  const labels = ghIssue.labels.map(label => label.name.toLowerCase());

  // Map status from labels (default to 'backlog')
  let status = 'backlog';
  if (labels.includes('status:todo')) status = 'todo';
  else if (labels.includes('status:inprogress') || labels.includes('status:in-progress')) status = 'inprogress';
  else if (labels.includes('status:review')) status = 'review';
  else if (labels.includes('status:done')) status = 'done';

  // Map priority from labels (default to 'medium')
  let priority: 'critical' | 'high' | 'medium' | 'low' = 'medium';
  if (labels.includes('priority:critical')) priority = 'critical';
  else if (labels.includes('priority:high')) priority = 'high';
  else if (labels.includes('priority:low')) priority = 'low';

  // Map type from labels (default to 'enhancement')
  let type: 'bug' | 'feature' | 'enhancement' | 'design' | 'docs' | 'test' | 'infrastructure' = 'enhancement';
  if (labels.includes('type:bug')) type = 'bug';
  else if (labels.includes('type:feature')) type = 'feature';
  else if (labels.includes('type:design')) type = 'design';
  else if (labels.includes('type:docs')) type = 'docs';
  else if (labels.includes('type:test')) type = 'test';
  else if (labels.includes('type:infrastructure')) type = 'infrastructure';

  // Extract story points from labels (e.g., 'points:5')
  let points = 1;
  const pointsLabel = labels.find(label => label.startsWith('points:'));
  if (pointsLabel) {
    const extracted = parseInt(pointsLabel.split(':')[1]);
    if (!isNaN(extracted)) points = extracted;
  }

  return {
    id: ghIssue.id,
    title: ghIssue.title,
    status,
    assignee: ghIssue.assignee?.login || 'Unassigned',
    priority,
    points,
    type,
    url: ghIssue.html_url,
    body: ghIssue.body,
  };
}