#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const projectRoot = path.resolve(__dirname, '..');
const cvSourceDir = path.resolve(projectRoot, 'cv');
const cvPublicDir = path.resolve(projectRoot, 'public', 'cv');

// Files to copy
const filesToCopy = ['cv.html', 'Luong_NGUYEN_CV.pdf', 'Luong_NGUYEN_CV.html', 'a8.png'];

// Ensure cv directory exists in public
if (!fs.existsSync(cvPublicDir)) {
  fs.mkdirSync(cvPublicDir, { recursive: true });
  console.log(`✓ Created ${cvPublicDir}`);
}

// Copy files
filesToCopy.forEach((file) => {
  const source = path.join(cvSourceDir, file);
  const destination = path.join(cvPublicDir, file);

  if (!fs.existsSync(source)) {
    console.warn(`⚠ Warning: ${file} not found at ${source}`);
    return;
  }

  try {
    fs.copyFileSync(source, destination);
    const stats = fs.statSync(destination);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✓ Copied ${file} (${sizeKB} KB)`);
  } catch (error) {
    console.error(`✗ Error copying ${file}:`, error.message);
    process.exit(1);
  }
});

// The submodule has no index.html, so /cv/ (and /cv, which GitHub Pages
// redirects to /cv/) would 404. Generate one here rather than in the cv repo so
// it survives CV updates. It redirects to the canonical CV page — the one
// inject-cv-seo (vite.config.ts) and sitemap.xml treat as canonical — instead of
// serving a third copy of the same content.
const cvCanonicalFile = 'Luong_NGUYEN_CV.html';
const cvCanonicalPath = `/cv/${cvCanonicalFile}`;
const cvCanonicalUrl = `https://luongnv.com${cvCanonicalPath}`;
const cvIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Luong Nguyen | CV</title>
  <link rel="canonical" href="${cvCanonicalUrl}">
  <meta http-equiv="refresh" content="0; url=${cvCanonicalPath}">
</head>
<body>
  <p>Opening the CV… If nothing happens, go to <a href="${cvCanonicalPath}">${cvCanonicalUrl}</a>.</p>
</body>
</html>
`;

if (fs.existsSync(path.join(cvPublicDir, cvCanonicalFile))) {
  fs.writeFileSync(path.join(cvPublicDir, 'index.html'), cvIndexHtml);
  console.log(`✓ Wrote index.html (redirects /cv/ to ${cvCanonicalPath})`);
} else {
  console.warn(`⚠ Warning: skipped index.html — ${cvCanonicalFile} was not copied`);
}

console.log('\n✓ CV files ready for deployment');
