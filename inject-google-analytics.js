const fs = require('fs');
const path = require('path');

// ==========================================
// ENTER YOUR GOOGLE ANALYTICS ID HERE
// ==========================================
const GA_MEASUREMENT_ID = ''; // E.g., 'G-XXXXXXXXXX'
// ==========================================

if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
  console.log('⚠️ Please open this script and specify your GA_MEASUREMENT_ID first!');
  process.exit(1);
}

const gaScript = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}');
</script>`;

// Helper function to recursively find all HTML files
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // Exclude node_modules, .git, and _next directories
      if (file !== 'node_modules' && file !== '.git' && file !== '_next') {
        getHtmlFiles(filePath, fileList);
      }
    } else if (path.extname(file) === '.html') {
      fileList.push(filePath);
    }
  });
  return fileList;
}

console.log('🔍 Scanning directory for HTML files...');
const htmlFiles = getHtmlFiles(__dirname);
console.log(`Found ${htmlFiles.length} HTML files.`);

let updatedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(__dirname, filePath);

  // Remove existing GA tag if present to prevent duplication
  const gaBlockRegex = /<!-- Google tag \(gtag\.js\) -->[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/gi;
  let cleanedContent = content.replace(gaBlockRegex, '');

  // Inject the new GA script before </head>
  if (cleanedContent.includes('</head>')) {
    const parts = cleanedContent.split('</head>');
    const newContent = parts[0] + '\n' + gaScript + '\n</head>' + parts.slice(1).join('</head>');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ GA tag injected/updated in: ${relativePath}`);
    updatedCount++;
  } else {
    console.log(`⚠️ No </head> tag found in: ${relativePath}`);
  }
});

// Also update GA_MEASUREMENT_ID in generate-template-pages.js
const genScriptPath = path.join(__dirname, 'generate-template-pages.js');
if (fs.existsSync(genScriptPath)) {
  let genScript = fs.readFileSync(genScriptPath, 'utf8');
  // Update the GA_MEASUREMENT_ID definition
  genScript = genScript.replace(
    /const GA_MEASUREMENT_ID = '[^']*';/,
    `const GA_MEASUREMENT_ID = '${GA_MEASUREMENT_ID}';`
  );
  fs.writeFileSync(genScriptPath, genScript, 'utf8');
  console.log(`✅ Updated GA_MEASUREMENT_ID in generate-template-pages.js`);
}

console.log(`\n🎉 Success! Google Analytics tag injected/updated in ${updatedCount} files.`);
