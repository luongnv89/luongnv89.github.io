#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const projectRoot = path.resolve(__dirname, '..');
const cvSourceDir = path.resolve(projectRoot, '..', 'cv');
const cvPublicDir = path.resolve(projectRoot, 'public', 'cv');

// Files to copy
const filesToCopy = ['cv.html', 'Luong_NGUYEN_CV.pdf', 'Luong_NGUYEN_CV.html'];

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

console.log('\n✓ CV files ready for deployment');
