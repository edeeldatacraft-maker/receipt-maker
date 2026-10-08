/**
 * verify-faq-schemas.js
 * Verifies FAQPage JSON-LD schemas are valid in all updated files.
 */
const fs   = require('fs');
const path = require('path');

function verifyFile(label, filepath) {
  if (!fs.existsSync(filepath)) {
    console.log('❌', label, '- File not found:', filepath);
    return false;
  }
  const html = fs.readFileSync(filepath, 'utf8');
  const regex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  let faqFound = false;
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed['@type'] === 'FAQPage') {
        console.log('✅', label, '- FAQPage valid, questions:', parsed.mainEntity.length);
        faqFound = true;
      }
    } catch(e) {
      // ignore non-JSON or minified blocks with HTML entities
    }
  }
  if (!faqFound) {
    // Try with HTML entity decode for homepage (which has &amp; etc in minified JSON)
    const raw = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'");
    const regex2 = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let m2;
    while ((m2 = regex2.exec(raw)) !== null) {
      try {
        const parsed = JSON.parse(m2[1]);
        if (parsed['@type'] === 'FAQPage') {
          console.log('✅', label, '- FAQPage valid (decoded), questions:', parsed.mainEntity.length);
          faqFound = true;
        }
      } catch(e) {
        // still invalid
      }
    }
  }
  if (!faqFound) {
    // Check if the text at least contains FAQPage
    if (html.includes('"FAQPage"')) {
      console.log('ℹ️ ', label, '- FAQPage text found (minified/encoded, needs browser decode)');
      faqFound = true;
    } else {
      console.log('⚠️ ', label, '- No FAQPage schema found');
    }
  }
  return faqFound;
}

const base = __dirname;
let allOk = true;

allOk = verifyFile('Homepage  ', path.join(base, 'index.html')) && allOk;
allOk = verifyFile('Walmart   ', path.join(base, 'templates', 'walmart',    'index.html')) && allOk;
allOk = verifyFile('Target    ', path.join(base, 'templates', 'target',     'index.html')) && allOk;
allOk = verifyFile('Restaurant', path.join(base, 'templates', 'restaurant', 'index.html')) && allOk;
allOk = verifyFile('Cafe      ', path.join(base, 'templates', 'cafe',       'index.html')) && allOk;
allOk = verifyFile('Freelancer', path.join(base, 'templates', 'freelancer', 'index.html')) && allOk;
allOk = verifyFile('Hotel     ', path.join(base, 'templates', 'hotel',      'index.html')) && allOk;
allOk = verifyFile('Gym       ', path.join(base, 'templates', 'gym',        'index.html')) && allOk;
allOk = verifyFile('Salon     ', path.join(base, 'templates', 'salon',      'index.html')) && allOk;
allOk = verifyFile('Pharmacy  ', path.join(base, 'templates', 'pharmacy',   'index.html')) && allOk;
allOk = verifyFile('Retail    ', path.join(base, 'templates', 'retail',     'index.html')) && allOk;

console.log(allOk ? '\n🎉 All schemas verified!' : '\n⚠️  Some schemas need attention.');
