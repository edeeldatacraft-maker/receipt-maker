const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const GA_ID = args[0];

if (!GA_ID || !GA_ID.startsWith('G-')) {
  console.error('❌ Error: Please provide a valid GA4 Measurement ID (starting with G-).');
  console.error('Example: node inject-ga.js G-XXXXXXXXXX');
  process.exit(1);
}

const ROOT_DIR = __dirname;
const GA_SCRIPT = `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  </script>
`;

// 1. Update GA_MEASUREMENT_ID inside generate-template-pages.js
const genScriptPath = path.join(ROOT_DIR, 'generate-template-pages.js');
if (fs.existsSync(genScriptPath)) {
  let content = fs.readFileSync(genScriptPath, 'utf8');
  content = content.replace(
    /const GA_MEASUREMENT_ID = '[^']*';/,
    `const GA_MEASUREMENT_ID = '${GA_ID}';`
  );
  fs.writeFileSync(genScriptPath, content, 'utf8');
  console.log('✓ Updated GA_MEASUREMENT_ID in generate-template-pages.js');
}

// 2. Generate template pages with GA snippet
try {
  console.log('Generating template pages with GA4 tracking...');
  execSync('node generate-template-pages.js', { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Error running generate-template-pages.js:', e.message);
}

// 3. Inject GA snippet into other static root html files
const targetHtmlFiles = [
  'index.html',
  'contact-us/index.html',
  'privacy-policy/index.html',
  'terms-of-service/index.html',
  'receipt-maker/index.html',
  'blog/index.html'
];

targetHtmlFiles.forEach(relPath => {
  const filePath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${relPath}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Check if GA already injected
  if (html.includes('googletagmanager.com/gtag/js')) {
    console.log(`✓ GA tag already present in: ${relPath}`);
    return;
  }

  // Inject before </head>
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${GA_SCRIPT}</head>`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ Injected GA4 into: ${relPath}`);
  } else {
    console.warn(`⚠️ Could not find </head> tag in: ${relPath}`);
  }
});

// 4. Inject GA snippet into blog post folders recursively
const blogDir = path.join(ROOT_DIR, 'blog');
if (fs.existsSync(blogDir)) {
  const posts = fs.readdirSync(blogDir);
  posts.forEach(post => {
    const postPath = path.join(blogDir, post);
    if (fs.statSync(postPath).isDirectory()) {
      const indexPath = path.join(postPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');
        if (!html.includes('googletagmanager.com/gtag/js')) {
          if (html.includes('</head>')) {
            html = html.replace('</head>', `${GA_SCRIPT}</head>`);
            fs.writeFileSync(indexPath, html, 'utf8');
            console.log(`✓ Injected GA4 into blog post: blog/${post}/index.html`);
          }
        }
      }
    }
  });
}

// 5. Re-bundle Zip file
try {
  console.log('Re-building deployment ZIP package...');
  execSync('node create-zip.js', { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Error running create-zip.js:', e.message);
}

console.log('\n🎉 GA4 Integration complete! All static pages are tracked.');
