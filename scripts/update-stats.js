#!/usr/bin/env node

/**
 * Script to update project stats from GitHub API
 *
 * Usage:
 *   node scripts/update-stats.js
 *
 * This script:
 * 1. Fetches the latest star counts for all projects in projects.json
 * 2. Updates the projects.json file with the new star counts
 * 3. Optionally updates a stats.json file with GitHub user stats
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_USERNAME = 'luongnv89';
const PROJECTS_FILE = join(__dirname, '../src/data/projects.json');

// Parse GitHub repo URL to get owner and repo name
function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
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

  // Read current projects
  const projectsData = JSON.parse(readFileSync(PROJECTS_FILE, 'utf-8'));
  let updated = false;

  // Update each project
  for (const project of projectsData.projects) {
    const parsed = parseGitHubUrl(project.url);
    if (!parsed) {
      console.log(`⚠️  Skipping ${project.name}: Invalid GitHub URL`);
      continue;
    }

    const stats = await fetchRepoStats(parsed.owner, parsed.repo);
    if (stats) {
      const oldStars = project.stars;
      const newStars = stats.stargazers_count;

      if (oldStars !== newStars) {
        project.stars = newStars;
        const diff = newStars - oldStars;
        const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
        console.log(`⭐ ${project.name}: ${oldStars} → ${newStars} (${diffStr})`);
        updated = true;
      } else {
        console.log(`✓  ${project.name}: ${newStars} stars (no change)`);
      }
    }

    // Rate limiting: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Save updated projects
  if (updated) {
    writeFileSync(PROJECTS_FILE, JSON.stringify(projectsData, null, 2) + '\n');
    console.log('\n✅ projects.json updated');
  } else {
    console.log('\n✓ No changes to projects.json');
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
