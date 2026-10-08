/**
 * fix-orphan-pages.js
 * Adds a "Related Templates" section with direct internal links to each individual
 * template page, fixing the "Orphan page (has no incoming internal links)" audit issue.
 * 
 * Run with: node fix-orphan-pages.js
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES = [
  // RETAIL
  {id:"walmart",name:"Walmart Receipt Template",cat:"retail",catName:"Retail",emoji:"🛒"},
  {id:"target",name:"Target Receipt Template",cat:"retail",catName:"Retail",emoji:"🛒"},
  {id:"costco",name:"Costco Wholesale Receipt Template",cat:"retail",catName:"Retail",emoji:"🛒"},
  {id:"bestbuy",name:"Best Buy Receipt Template",cat:"retail",catName:"Retail",emoji:"🛒"},
  {id:"kroger",name:"Kroger Grocery Receipt Template",cat:"retail",catName:"Retail",emoji:"🛒"},
  {id:"cvs",name:"CVS Pharmacy Receipt Template",cat:"retail",catName:"Retail",emoji:"🛒"},
  {id:"amazon",name:"Amazon Order Receipt Template",cat:"retail",catName:"Retail",emoji:"🛒"},
  // RESTAURANT
  {id:"diner",name:"Classic Diner Receipt Template",cat:"restaurant",catName:"Restaurant",emoji:"🍽️"},
  {id:"fine_dining",name:"Fine Dining Receipt Template",cat:"restaurant",catName:"Restaurant",emoji:"🍽️"},
  {id:"cafe",name:"Cafe & Coffee Receipt Template",cat:"restaurant",catName:"Restaurant",emoji:"🍽️"},
  {id:"pizza",name:"Pizza & Fast Food Receipt Template",cat:"restaurant",catName:"Restaurant",emoji:"🍽️"},
  {id:"sushi",name:"Asian Restaurant Receipt Template",cat:"restaurant",catName:"Restaurant",emoji:"🍽️"},
  {id:"bakery",name:"Bakery & Desserts Receipt Template",cat:"restaurant",catName:"Restaurant",emoji:"🍽️"},
  // SERVICES
  {id:"freelancer",name:"Freelancer Receipt Template",cat:"services",catName:"Services",emoji:"⚡"},
  {id:"salon",name:"Salon & Beauty Receipt Template",cat:"services",catName:"Services",emoji:"⚡"},
  {id:"gym",name:"Gym & Fitness Receipt Template",cat:"services",catName:"Services",emoji:"⚡"},
  {id:"cleaning",name:"Home Cleaning Receipt Template",cat:"services",catName:"Services",emoji:"⚡"},
  {id:"consulting",name:"Consulting Receipt Template",cat:"services",catName:"Services",emoji:"⚡"},
  {id:"plumber",name:"Plumber & Handyman Receipt Template",cat:"services",catName:"Services",emoji:"⚡"},
  // HEALTHCARE
  {id:"clinic",name:"Medical Clinic Receipt Template",cat:"healthcare",catName:"Healthcare",emoji:"🏥"},
  {id:"pharmacy",name:"Pharmacy Receipt Template",cat:"healthcare",catName:"Healthcare",emoji:"🏥"},
  {id:"dental",name:"Dental Clinic Receipt Template",cat:"healthcare",catName:"Healthcare",emoji:"🏥"},
  {id:"optician",name:"Eye Care & Optician Receipt Template",cat:"healthcare",catName:"Healthcare",emoji:"🏥"},
  {id:"physio",name:"Physiotherapy Receipt Template",cat:"healthcare",catName:"Healthcare",emoji:"🏥"},
  // AUTOMOTIVE
  {id:"garage",name:"Auto Repair Shop Receipt Template",cat:"automotive",catName:"Automotive",emoji:"🚗"},
  {id:"carwash",name:"Car Wash Receipt Template",cat:"automotive",catName:"Automotive",emoji:"🚗"},
  {id:"fuel",name:"Gas Station Receipt Template",cat:"automotive",catName:"Automotive",emoji:"🚗"},
  {id:"parking",name:"Parking Ticket Receipt Template",cat:"automotive",catName:"Automotive",emoji:"🚗"},
  {id:"tires",name:"Tire Shop Receipt Template",cat:"automotive",catName:"Automotive",emoji:"🚗"},
  // HOTEL
  {id:"hotel",name:"Hotel Folio Receipt Template",cat:"hotel",catName:"Hotel",emoji:"🏨"},
  {id:"vacation_rental",name:"Vacation Rental Receipt Template",cat:"hotel",catName:"Hotel",emoji:"🏨"},
  {id:"resort",name:"Luxury Resort Receipt Template",cat:"hotel",catName:"Hotel",emoji:"🏨"},
  {id:"hostel",name:"Hostel & Budget Receipt Template",cat:"hotel",catName:"Hotel",emoji:"🏨"},
  // TRAVEL
  {id:"travel_tours",name:"Sultan Travel and Tours Receipt Template",cat:"travel",catName:"Travel & Tours",emoji:"✈️"},
];

const TEMPLATES_DIR = path.join(__dirname, 'templates');

function buildRelatedSection(currentId, currentCat) {
  // Get up to 4 siblings from same category (excluding current)
  let siblings = TEMPLATES.filter(t => t.cat === currentCat && t.id !== currentId);
  // If fewer than 4 siblings, supplement with templates from other categories
  if (siblings.length < 4) {
    const others = TEMPLATES.filter(t => t.cat !== currentCat && t.id !== currentId);
    siblings = [...siblings, ...others.slice(0, 4 - siblings.length)];
  }
  // Limit to 4
  siblings = siblings.slice(0, 4);

  const linkItems = siblings.map(t => `
          <a href="/templates/${t.id}/" style="display:block;background:#fff;border-radius:16px;border:2px solid #e2e8f0;padding:16px 18px;text-decoration:none;color:inherit;transition:all .2s;" onmouseover="this.style.borderColor='#4f46e5';this.style.boxShadow='0 8px 24px rgba(79,70,229,.12)';this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='#e2e8f0';this.style.boxShadow='';this.style.transform='';">
            <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">${t.catName}</div>
            <div style="font-weight:800;font-size:14px;color:#0f172a;">${t.name}</div>
            <div style="margin-top:8px;font-size:12px;font-weight:700;color:#4f46e5;">View Template →</div>
          </a>`).join('');

  return `
    <!-- RELATED TEMPLATES: Internal links to fix orphan page SEO issue -->
    <section style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:48px 0;margin-top:0;">
      <div style="max-width:1200px;margin:0 auto;padding:0 24px;">
        <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 6px;">Related Receipt Templates</h2>
        <p style="font-size:14px;color:#64748b;margin:0 0 24px;">Browse more free receipt templates from our collection.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
          ${linkItems}
        </div>
        <div style="margin-top:24px;text-align:center;">
          <a href="/templates/" style="display:inline-flex;align-items:center;gap:8px;background:#4f46e5;color:#fff;padding:12px 28px;border-radius:999px;font-weight:800;font-size:14px;text-decoration:none;transition:background .2s;" onmouseover="this.style.background='#4338ca';" onmouseout="this.style.background='#4f46e5';">
            View All 34+ Templates →
          </a>
        </div>
      </div>
    </section>`;
}

let processed = 0;
let skipped = 0;

for (const tpl of TEMPLATES) {
  const filePath = path.join(TEMPLATES_DIR, tpl.id, 'index.html');
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping (no file): /templates/${tpl.id}/`);
    skipped++;
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already patched
  if (html.includes('RELATED TEMPLATES: Internal links to fix orphan page SEO issue')) {
    console.log(`✓  Already patched: /templates/${tpl.id}/`);
    skipped++;
    continue;
  }

  const relatedSection = buildRelatedSection(tpl.id, tpl.cat);

  // Insert the related section before the footer
  if (html.includes('<!-- FOOTER -->')) {
    html = html.replace('<!-- FOOTER -->', relatedSection + '\n\n    <!-- FOOTER -->');
  } else if (html.includes('<footer')) {
    html = html.replace('<footer', relatedSection + '\n\n    <footer');
  } else {
    console.log(`⚠️  Could not find footer injection point: /templates/${tpl.id}/`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅  Fixed: /templates/${tpl.id}/`);
  processed++;
}

console.log(`\n📊 Summary: ${processed} fixed, ${skipped} skipped.`);
