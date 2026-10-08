const fs = require('fs');
const path = require('path');

const BASE = 'https://receipts-maker.com';
const ROOT = __dirname;

// Pages to add canonical tags to, mapping relative path -> canonical URL
const pages = [
  // Root homepage
  { file: 'index.html',                         canonical: `${BASE}/` },

  // Blog listing
  { file: 'blog/index.html',                    canonical: `${BASE}/blog/` },

  // Blog posts
  { file: 'blog/5-receipt-generators-compared-which-one-is-the-best/index.html',
    canonical: `${BASE}/blog/5-receipt-generators-compared-which-one-is-the-best/` },
  { file: 'blog/7-best-practices-for-customizing-business-receipts/index.html',
    canonical: `${BASE}/blog/7-best-practices-for-customizing-business-receipts/` },
  { file: 'blog/how-to-create-a-receipt/index.html',
    canonical: `${BASE}/blog/how-to-create-a-receipt/` },
  { file: 'blog/how-to-generate-and-print-receipts-at-home-using-a-thermal-printer/index.html',
    canonical: `${BASE}/blog/how-to-generate-and-print-receipts-at-home-using-a-thermal-printer/` },
  { file: 'blog/how-to-generate-missing-receipts-online/index.html',
    canonical: `${BASE}/blog/how-to-generate-missing-receipts-online/` },
  { file: 'blog/how-to-use-receipt-generators-to-recover-lost-receipts/index.html',
    canonical: `${BASE}/blog/how-to-use-receipt-generators-to-recover-lost-receipts/` },
  { file: 'blog/how-to-write-a-receipt-for-payment/index.html',
    canonical: `${BASE}/blog/how-to-write-a-receipt-for-payment/` },
  { file: 'blog/receipt-format-guide/index.html',
    canonical: `${BASE}/blog/receipt-format-guide/` },
  { file: 'blog/receipt-vs-invoice-differences/index.html',
    canonical: `${BASE}/blog/receipt-vs-invoice-differences/` },
  { file: 'blog/reimbursing-expenses-with-generated-receipts/index.html',
    canonical: `${BASE}/blog/reimbursing-expenses-with-generated-receipts/` },
  { file: 'blog/top-5-printers-for-printing-receipts/index.html',
    canonical: `${BASE}/blog/top-5-printers-for-printing-receipts/` },
  { file: 'blog/what-is-an-itemized-receipt/index.html',
    canonical: `${BASE}/blog/what-is-an-itemized-receipt/` },

  // Public utility pages
  { file: 'contact-us/index.html',              canonical: `${BASE}/contact-us/` },
  { file: 'receipt-maker/index.html',           canonical: `${BASE}/receipt-maker/` },

  // Already have canonicals — kept for safety (script will skip if already present)
  // privacy-policy, terms-of-service, cookie-policy, templates
];

// Pages intentionally skipped (private/dynamic/internal):
// dashboard, receipt, preview, login, signup, forgot-password, reset-password, 404

let updated = 0;
let skipped = 0;

for (const { file, canonical } of pages) {
  const filePath = path.join(ROOT, file);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  MISSING: ${file}`);
    skipped++;
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if canonical already present
  if (html.includes('rel="canonical"') || html.includes("rel='canonical'")) {
    console.log(`✓  SKIP (already has canonical): ${file}`);
    skipped++;
    continue;
  }

  const canonicalTag = `<link rel="canonical" href="${canonical}"/>`;

  // Insert before </head> — handles both minified (single line) and formatted HTML
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${canonicalTag}</head>`);
  } else if (html.includes('<link rel="icon"')) {
    // Fallback: insert right before the favicon link
    html = html.replace('<link rel="icon"', `${canonicalTag}<link rel="icon"`);
  } else {
    console.warn(`⚠️  Could not find insertion point in: ${file}`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ UPDATED: ${file}  →  ${canonical}`);
  updated++;
}

console.log(`\nDone! Updated: ${updated}, Skipped/Already done: ${skipped}`);
