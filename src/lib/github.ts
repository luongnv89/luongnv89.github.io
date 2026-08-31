export interface GitHubStats {
  followers: number
  publicRepos: number
  totalStars: number
  totalForks: number
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    if (!response.ok) return null

    const data = await response.json()

    // Fetch ALL repos (paginated) — the account has >100 public repos, so a
    // single per_page=100 page would silently truncate the star/fork totals.
    let totalStars = 0
    let totalForks = 0
    let page = 1
    const perPage = 100
    while (true) {
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`
      )
      if (!reposResponse.ok) break
      const repos = await reposResponse.json()
      if (!Array.isArray(repos) || repos.length === 0) break

      for (const repo of repos) {
        totalStars += repo.stargazers_count || 0
        totalForks += repo.forks_count || 0
      }
      if (repos.length < perPage) break
      page++
    }

    return {
      followers: data.followers || 0,
      publicRepos: data.public_repos || 0,
      totalStars,
      totalForks,
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error)
    return null
  }
}
