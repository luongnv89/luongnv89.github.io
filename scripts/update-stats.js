#!/usr/bin/env node

/**
 * Script to update project stats from GitHub API
 *
 * Usage:
 *   node scripts/update-stats.js
 *
 * Auth: Uses `gh` CLI token automatically (no .env needed)
 * Optimization: Deduplicates repos across data files, batches user repo fetch
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_USERNAME = 'luongnv89';
const DATA_FILES = [
  join(__dirname, '../src/data/projects.json'),
  join(__dirname, '../src/data/portfolio.json'),
];

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  delayBetweenRequests: 300, // ms between repo requests
  maxRetries: 4,
  retryDelay: 2000,
  backoffMultiplier: 2,
};

// ── Auth ──────────────────────────────────────────────────────────────────────

function getGitHubToken() {
  // 1. Try gh CLI (preferred — uses machine's authenticated session)
  try {
    const token = execSync('gh auth token', { stdio: ['pipe', 'pipe', 'pipe'] })
      .toString()
      .trim();
    if (token) return { token, source: 'gh CLI' };
  } catch (_) {}

  // 2. Fall back to environment variable
  if (process.env.GITHUB_TOKEN) {
    return { token: process.env.GITHUB_TOKEN, source: 'GITHUB_TOKEN env' };
  }

  return { token: null, source: 'none (unauthenticated — rate limit: 60 req/h)' };
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function buildHeaders(token) {
  return {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'update-stats-script',
    ...(token ? { 'Authorization': `token ${token}` } : {}),
  };
}

async function githubFetch(url, headers, retryCount = 0) {
  const response = await fetch(url, { headers });

  if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
    if (retryCount < RATE_LIMIT_CONFIG.maxRetries) {
      const delayMs = RATE_LIMIT_CONFIG.retryDelay * Math.pow(RATE_LIMIT_CONFIG.backoffMultiplier, retryCount);
      process.stdout.write(`\r  ⏳ HTTP ${response.status} — retry ${retryCount + 1}/${RATE_LIMIT_CONFIG.maxRetries} in ${delayMs / 1000}s...`);
      await sleep(delayMs);
      return githubFetch(url, headers, retryCount + 1);
    }
  }

  if (response.status === 403) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    if (remaining === '0' && reset) {
      const waitMs = (parseInt(reset, 10) * 1000 - Date.now()) + 1000;
      const waitSec = Math.ceil(waitMs / 1000);
      if (retryCount < RATE_LIMIT_CONFIG.maxRetries && waitMs < 120_000) {
        process.stdout.write(`\r  ⏳ Rate limit hit — waiting ${waitSec}s for reset...`);
        await sleep(waitMs);
        return githubFetch(url, headers, retryCount + 1);
      }
    }
  }

  return response;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── GitHub API calls ──────────────────────────────────────────────────────────

function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

async function fetchRepoStats(owner, repo, headers) {
  const response = await githubFetch(`https://api.github.com/repos/${owner}/${repo}`, headers);
  if (!response.ok) return null;
  const data = await response.json();
  return { stars: data.stargazers_count, forks: data.forks_count };
}

async function fetchUserStats(username, headers) {
  const response = await githubFetch(`https://api.github.com/users/${username}`, headers);
  if (!response.ok) return null;
  return response.json();
}

async function fetchAllRepos(username, headers) {
  const all = [];
  let page = 1;
  while (true) {
    const response = await githubFetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
      headers
    );
    if (!response.ok) break;
    const repos = await response.json();
    if (!repos.length) break;
    all.push(...repos);
    if (repos.length < 100) break;
    page++;
    await sleep(RATE_LIMIT_CONFIG.delayBetweenRequests);
  }
  return all;
}

// ── Progress display ──────────────────────────────────────────────────────────

function printProgress(current, total, name) {
  const pct = Math.round((current / total) * 100);
  const filled = Math.round(pct / 5);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
  process.stdout.write(`\r  [${bar}] ${pct}%  ${current}/${total}  ${name.slice(0, 35).padEnd(35)}`);
}

function printSummaryTable(results) {
  const changed = results.filter(r => r.changed);
  const unchanged = results.filter(r => !r.changed && r.fetched);
  const failed = results.filter(r => !r.fetched);

  const col1 = Math.max(12, ...results.map(r => r.name.length)) + 2;

  console.log('\n');
  console.log('┌' + '─'.repeat(col1) + '┬──────────┬──────────┬────────────────┐');
  console.log('│' + ' Repo'.padEnd(col1) + '│  Stars   │  Forks   │ Change         │');
  console.log('├' + '─'.repeat(col1) + '┼──────────┼──────────┼────────────────┤');

  for (const r of results) {
    const name = (' ' + r.name).slice(0, col1).padEnd(col1);
    if (!r.fetched) {
      console.log(`│${name}│  ${'N/A'.padEnd(8)}│  ${'N/A'.padEnd(8)}│ ${'⚠ fetch failed'.padEnd(15)}│`);
    } else {
      const starDiff = r.newStars - r.oldStars;
      const forkDiff = r.newForks - r.oldForks;
      const diffStr = r.changed
        ? `⭐${starDiff >= 0 ? '+' : ''}${starDiff} 🍴${forkDiff >= 0 ? '+' : ''}${forkDiff}`
        : '—';
      console.log(
        `│${name}│  ${String(r.newStars).padEnd(8)}│  ${String(r.newForks).padEnd(8)}│ ${diffStr.padEnd(15)}│`
      );
    }
  }

  console.log('└' + '─'.repeat(col1) + '┴──────────┴──────────┴────────────────┘');
  console.log(`\n  Updated: ${changed.length}  |  Unchanged: ${unchanged.length}  |  Failed: ${failed.length}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const { token, source } = getGitHubToken();
  const headers = buildHeaders(token);

  console.log('┌─────────────────────────────────────────┐');
  console.log('│         GitHub Stats Updater             │');
  console.log('└─────────────────────────────────────────┘');
  console.log(`  Auth   : ${source}`);
  console.log(`  User   : ${GITHUB_USERNAME}`);
  console.log(`  Delay  : ${RATE_LIMIT_CONFIG.delayBetweenRequests}ms between requests`);
  console.log(`  Retries: up to ${RATE_LIMIT_CONFIG.maxRetries}`);
  console.log('');

  // Load data files
  const datasets = DATA_FILES.map((file) => ({
    file,
    data: JSON.parse(readFileSync(file, 'utf-8')),
    updated: false,
  }));

  // Collect unique repos across all data files (deduplicate)
  const repoMap = new Map(); // key → { owner, repo, projects: [{project, dataset}] }
  for (const dataset of datasets) {
    for (const project of dataset.data.projects) {
      const parsed = parseGitHubUrl(project.url || '');
      if (!parsed) continue;
      const key = `${parsed.owner}/${parsed.repo}`;
      if (!repoMap.has(key)) {
        repoMap.set(key, { ...parsed, entries: [] });
      }
      repoMap.get(key).entries.push({ project, dataset });
    }
  }

  const repos = [...repoMap.entries()];
  const results = [];

  console.log(`  Fetching stats for ${repos.length} unique repos...\n`);

  for (let i = 0; i < repos.length; i++) {
    const [key, { owner, repo, entries }] = repos[i];
    printProgress(i + 1, repos.length, `${owner}/${repo}`);

    const stats = await fetchRepoStats(owner, repo, headers);

    // Track result once per unique repo (for display)
    let resultAdded = false;
    for (const { project, dataset } of entries) {
      const oldStars = project.stars ?? 0;
      const oldForks = project.forks ?? 0;
      const newStars = stats?.stars ?? oldStars;
      const newForks = stats?.forks ?? oldForks;
      const changed = stats && (oldStars !== newStars || oldForks !== newForks);

      if (!resultAdded) {
        results.push({ name: `${owner}/${repo}`, oldStars, oldForks, newStars, newForks, changed, fetched: !!stats });
        resultAdded = true;
      }

      if (changed) {
        project.stars = newStars;
        project.forks = newForks;
        dataset.updated = true;
      }
    }

    if (i < repos.length - 1) {
      await sleep(RATE_LIMIT_CONFIG.delayBetweenRequests);
    }
  }

  // Print summary table
  printSummaryTable(results);

  // Write updated files
  console.log('');
  let anyWritten = false;
  for (const dataset of datasets) {
    const name = dataset.file.split('/').pop();
    if (dataset.updated) {
      writeFileSync(dataset.file, JSON.stringify(dataset.data, null, 2) + '\n');
      console.log(`  ✅ ${name} — written`);
      anyWritten = true;
    } else {
      console.log(`  ✓  ${name} — no changes`);
    }
  }

  // Fetch user + total stars (single pass — reuse already-fetched repo list)
  console.log('\n  Fetching user profile & total star count...');
  const [userStats, allRepos] = await Promise.all([
    fetchUserStats(GITHUB_USERNAME, headers),
    fetchAllRepos(GITHUB_USERNAME, headers),
  ]);

  const totalStars = allRepos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

  if (userStats) {
    console.log('');
    console.log('┌──────────────────────────────────────┐');
    console.log(`│  @${GITHUB_USERNAME.padEnd(34)}│`);
    console.log('├──────────────────────────────────────┤');
    console.log(`│  Followers   : ${String(userStats.followers).padEnd(21)}│`);
    console.log(`│  Public Repos: ${String(userStats.public_repos).padEnd(21)}│`);
    console.log(`│  Total Stars : ${String(totalStars).padEnd(21)}│`);
    console.log('└──────────────────────────────────────┘');
  }

  console.log('\n  🎉 Done!\n');
}

main().catch(err => {
  console.error('\n  ❌ Fatal error:', err.message);
  process.exit(1);
});
