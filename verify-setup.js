#!/usr/bin/env node

/**
 * Installation Verification Script
 * Run: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying project setup...\n');

const checks = [
  {
    name: 'Package.json',
    path: 'package.json',
    type: 'file',
  },
  {
    name: 'TypeScript config',
    path: 'tsconfig.json',
    type: 'file',
  },
  {
    name: 'Remotion config',
    path: 'remotion.config.ts',
    type: 'file',
  },
  {
    name: 'Source directory',
    path: 'src',
    type: 'directory',
  },
  {
    name: 'Components',
    path: 'src/components',
    type: 'directory',
  },
  {
    name: 'Themes',
    path: 'src/themes',
    type: 'directory',
  },
  {
    name: 'Compositions',
    path: 'src/compositions',
    type: 'directory',
  },
  {
    name: 'CLI tool',
    path: 'src/cli.ts',
    type: 'file',
  },
  {
    name: 'Root component',
    path: 'src/Root.tsx',
    type: 'file',
  },
  {
    name: 'Zod schema',
    path: 'zod-presentation-schema.ts',
    type: 'file',
  },
  {
    name: 'Sample presentation',
    path: 'input/sample-presentation.json',
    type: 'file',
  },
  {
    name: 'Input directory',
    path: 'input',
    type: 'directory',
  },
  {
    name: 'Output directory',
    path: 'output',
    type: 'directory',
  },
  {
    name: 'Public directory',
    path: 'public',
    type: 'directory',
  },
  {
    name: 'README',
    path: 'README.md',
    type: 'file',
  },
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  const fullPath = path.join(__dirname, check.path);
  const exists = fs.existsSync(fullPath);
  
  if (check.type === 'directory') {
    const isDir = exists && fs.statSync(fullPath).isDirectory();
    if (isDir) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name} (not found or not a directory)`);
      failed++;
    }
  } else {
    const isFile = exists && fs.statSync(fullPath).isFile();
    if (isFile) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name} (not found or not a file)`);
      failed++;
    }
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✅ All checks passed! Project is ready.\n');
  console.log('Next steps:');
  console.log('  1. Run: npm install');
  console.log('  2. Run: npm start');
  console.log('  3. Read: QUICKSTART.md\n');
} else {
  console.log('❌ Some checks failed. Please review the setup.\n');
  process.exit(1);
}
