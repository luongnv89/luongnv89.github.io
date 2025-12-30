export interface GitHubStats {
  followers: number
  publicRepos: number
  totalStars: number
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    if (!response.ok) return null

    const data = await response.json()

    // Fetch repos to calculate total stars
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    const repos = await reposResponse.json()

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum: number, repo: { stargazers_count?: number }) => sum + (repo.stargazers_count || 0), 0)
      : 0

    return {
      followers: data.followers || 0,
      publicRepos: data.public_repos || 0,
      totalStars,
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error)
    return null
  }
}
