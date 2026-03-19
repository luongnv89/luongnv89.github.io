#!/usr/bin/env node

/**
 * Script to update project stats from GitHub API
 *
 * Usage:
 *   node scripts/update-stats.js
 *
 * This script:
 * 1. Fetches the latest star counts for GitHub-backed projects
 * 2. Updates the data files that power the portfolio/project sections
 * 3. Prints GitHub user stats for visibility in cron logs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_USERNAME = 'luongnv89';
const DATA_FILES = [
  join(__dirname, '../src/data/projects.json'),
  join(__dirname, '../src/data/portfolio.json'),
];

// Parse GitHub repo URL to get owner and repo name
function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

function repoKeyFromUrl(url) {
  const parsed = parseGitHubUrl(url);
  return parsed ? `${parsed.owner}/${parsed.repo}` : null;
}

// Fetch repo stats from GitHub API
async function fetchRepoStats(owner, repo) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'update-stats-script',
      ...(process.env.GITHUB_TOKEN && {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      })
    }
  });

  if (!response.ok) {
    console.error(`Failed to fetch ${owner}/${repo}: ${response.status}`);
    return null;
  }

  return response.json();
}

// Fetch GitHub user stats
async function fetchUserStats(username) {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'update-stats-script',
      ...(process.env.GITHUB_TOKEN && {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      })
    }
  });

  if (!response.ok) {
    console.error(`Failed to fetch user stats: ${response.status}`);
    return null;
  }

  return response.json();
}

// Fetch all repos to calculate total stars
async function fetchTotalStars(username) {
  let page = 1;
  let totalStars = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'update-stats-script',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          })
        }
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch repos page ${page}: ${response.status}`);
      break;
    }

    const repos = await response.json();
    if (repos.length === 0) {
      hasMore = false;
    } else {
      totalStars += repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      page++;
    }
  }

  return totalStars;
}

async function main() {
  console.log('🔄 Updating project stats from GitHub...\n');

  const datasets = DATA_FILES.map((file) => ({
    file,
    data: JSON.parse(readFileSync(file, 'utf-8')),
    updated: false,
  }));

  const repoStars = new Map();
  const seenRepos = [];

  for (const { data } of datasets) {
    for (const project of data.projects) {
      const key = repoKeyFromUrl(project.url);
      if (key && !repoStars.has(key)) {
        repoStars.set(key, null);
        seenRepos.push({ key, project });
      }
    }
  }

  for (const { key, project } of seenRepos) {
    const parsed = parseGitHubUrl(project.url);
    if (!parsed) {
      console.log(`⚠️  Skipping ${project.name}: Invalid GitHub URL`);
      continue;
    }

    const stats = await fetchRepoStats(parsed.owner, parsed.repo);
    if (stats) {
      repoStars.set(key, stats.stargazers_count);
    }

    // Rate limiting: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  for (const dataset of datasets) {
    for (const project of dataset.data.projects) {
      const key = repoKeyFromUrl(project.url);
      const newStars = key ? repoStars.get(key) : null;
      if (newStars == null) continue;

      const oldStars = project.stars;
      if (oldStars !== newStars) {
        project.stars = newStars;
        dataset.updated = true;
        const diff = newStars - oldStars;
        const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
        console.log(`⭐ ${project.name} (${dataset.file.split('/').pop()}): ${oldStars} → ${newStars} (${diffStr})`);
      } else {
        console.log(`✓  ${project.name} (${dataset.file.split('/').pop()}): ${newStars} stars (no change)`);
      }
    }
  }

  for (const dataset of datasets) {
    if (dataset.updated) {
      writeFileSync(dataset.file, JSON.stringify(dataset.data, null, 2) + '\n');
      console.log(`\n✅ ${dataset.file.split('/').pop()} updated`);
    } else {
      console.log(`\n✓ No changes to ${dataset.file.split('/').pop()}`);
    }
  }

  // Fetch and display user stats
  console.log('\n📊 Fetching GitHub user stats...');
  const userStats = await fetchUserStats(GITHUB_USERNAME);
  const totalStars = await fetchTotalStars(GITHUB_USERNAME);

  if (userStats) {
    console.log(`\n📈 GitHub Stats for @${GITHUB_USERNAME}:`);
    console.log(`   Followers: ${userStats.followers}`);
    console.log(`   Public Repos: ${userStats.public_repos}`);
    console.log(`   Total Stars: ${totalStars}`);
  }

  console.log('\n🎉 Done!');
}

main().catch(console.error);
