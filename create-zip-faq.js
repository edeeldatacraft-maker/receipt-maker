/**
 * create-zip-faq.js
 * Generates a fresh hostinger-build-updated.zip that includes
 * the newly injected FAQPage JSON-LD schemas.
 */
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT       = __dirname;
const OUTPUT_ZIP = path.join(ROOT, 'hostinger-build-updated.zip');
const TEMP_DIR   = path.join(ROOT, 'hostinger-faq-temp');

// Remove old zip if exists
if (fs.existsSync(OUTPUT_ZIP)) {
  fs.unlinkSync(OUTPUT_ZIP);
  console.log('🗑  Removed old hostinger-build-updated.zip');
}

// Remove old temp dir if exists
if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

// Create fresh temp dir
fs.mkdirSync(TEMP_DIR);

// Items to EXCLUDE from zip (build scripts, editor files, old zips etc.)
const excludes = new Set([
  'hostinger-build.zip',
  'hostinger-build-updated.zip',
  'hostinger-faq-temp',
  'hostinger-build-temp',
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
]);

const items = fs.readdirSync(ROOT).filter(item => !excludes.has(item));

console.log('\n📦 Copying items to temp directory:');
items.forEach(item => {
  const srcPath  = path.join(ROOT, item);
  const destPath = path.join(TEMP_DIR, item);
  console.log(`   + ${item}`);
  fs.cpSync(srcPath, destPath, { recursive: true });
});

// Build ZIP using Windows native tar (bsdtar) — UNIX forward slashes for Hostinger
try {
  console.log('\n🔨 Building ZIP archive… (this may take a moment)');
  execSync(`tar -a -c -f "${OUTPUT_ZIP}" -C "${TEMP_DIR}" .`, { stdio: 'inherit' });

  const stats  = fs.statSync(OUTPUT_ZIP);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ hostinger-build-updated.zip created!`);
  console.log(`   Size    : ${sizeMB} MB`);
  console.log(`   Location: ${OUTPUT_ZIP}`);
} finally {
  // Always clean up temp dir
  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log('🧹 Temp directory cleaned up.');
}
