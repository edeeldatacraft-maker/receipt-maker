const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const OUTPUT_ZIP = path.join(ROOT, 'hostinger-build.zip');
const TEMP_DIR = path.join(ROOT, 'hostinger-build-temp');

// Remove old zip if exists
if (fs.existsSync(OUTPUT_ZIP)) {
  fs.unlinkSync(OUTPUT_ZIP);
  console.log('Removed old hostinger-build.zip');
}

// Remove old temp dir if exists
if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log('Removed old temp directory');
}

// Create fresh temp dir
fs.mkdirSync(TEMP_DIR);

// Folders/files to EXCLUDE from zip
const excludes = [
  'hostinger-build.zip',
  'hostinger-build-updated.zip',
  'hostinger-build-temp',
  'hostinger-faq-temp',
  'node_modules',
  '.git',
  '.next',
  'add-canonicals.js',
  'create-zip.js',
  'create-zip-faq.js',
  'build-receipt-maker.js',
  'clean-blog.js',
  'clean-index.js',
  'find-all-projects.js',
  'find-nextjs.js',
  'find-on-d.js',
  'find-section.js',
  'replace-templates.js',
  'add-faq-schemas.js',
  'verify-faq-schemas.js',
  'fix-faq-no-main.js',
  'inject-ga.js',
  'inject-google-analytics.js',
  'generate-template-pages.js',
];

// Get all items in root dir that are NOT excluded
const items = fs.readdirSync(ROOT).filter(item => !excludes.includes(item));

console.log('Copying items to temp directory for zipping:');
items.forEach(item => {
  const srcPath = path.join(ROOT, item);
  const destPath = path.join(TEMP_DIR, item);
  console.log(`  + ${item}`);
  fs.cpSync(srcPath, destPath, { recursive: true });
});

// Use Windows native tar (bsdtar) to create the ZIP.
// tar always uses standard UNIX forward slashes "/" for paths,
// which is required for Linux-based hosting platforms like Hostinger.
try {
  console.log('\nBuilding ZIP archive with standard forward slashes... (this may take a moment)');
  execSync(`tar -a -c -f "${OUTPUT_ZIP}" -C "${TEMP_DIR}" .`, { stdio: 'inherit' });
  
  const stats = fs.statSync(OUTPUT_ZIP);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ hostinger-build.zip created! Size: ${sizeMB} MB`);
  console.log(`📁 Location: ${OUTPUT_ZIP}`);
} finally {
  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}


