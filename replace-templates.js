const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const templatesPos = html.indexOf('id="templates"');
if (templatesPos === -1) {
  console.error('Error: Could not find templates section in index.html!');
  process.exit(1);
}

let secStart = templatesPos;
while (secStart > 0 && html.substring(secStart, secStart + 8) !== '<section') {
  secStart--;
}

const nextSecPos = html.indexOf('<section', templatesPos + 20);
if (nextSecPos === -1) {
  console.error('Error: Could not find next section after templates in index.html!');
  process.exit(1);
}

let secEnd = nextSecPos;
while (secEnd > 0 && html.substring(secEnd - 10, secEnd) !== '</section>') {
  secEnd--;
}

// NEW CATEGORY TEMPLATE SECTION (HTML entities used for emojis to prevent Mojibake)
const newSection = `<section class="py-20 bg-slate-50" id="templates">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="text-center max-w-3xl mx-auto mb-14">
<div class="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-5">50+ Templates</div>
<h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Receipt Templates by Category</h2>
<p class="text-lg text-slate-600">Choose from professionally designed templates for every industry. Click any category to get started instantly.</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;">

<a href="/templates/?cat=retail" style="display:block;border-radius:20px;overflow:hidden;border:2px solid #e2e8f0;background:#fff;text-decoration:none;transition:all .25s;box-shadow:0 2px 8px rgba(0,0,0,.04);" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(79,70,229,.15)';this.style.borderColor='#4f46e5';" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='#e2e8f0';">
<div style="height:180px;overflow:hidden;position:relative;background:linear-gradient(135deg,#0071CE 0%,#004F9E 100%);">
<img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80&auto=format&fit=crop" alt="Retail Receipts" style="width:100%;height:100%;object-fit:cover;opacity:.35;"/>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;">
<span style="font-size:40px;margin-bottom:8px;">&#128722;</span>
<span style="font-size:20px;font-weight:900;letter-spacing:-.02em;">Retail</span>
<span style="font-size:12px;opacity:.8;margin-top:2px;">7 templates</span>
</div>
</div>
<div style="padding:16px 18px;display:flex;justify-content:space-between;align-items:center;">
<div>
<div style="font-weight:800;font-size:15px;color:#0f172a;">Retail Templates</div>
<div style="font-size:12px;color:#94a3b8;margin-top:2px;">Walmart, Target, Costco &amp; more</div>
</div>
<div style="background:#eef2ff;color:#4f46e5;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;">Browse &rarr;</div>
</div>
</a>

<a href="/templates/?cat=restaurant" style="display:block;border-radius:20px;overflow:hidden;border:2px solid #e2e8f0;background:#fff;text-decoration:none;transition:all .25s;box-shadow:0 2px 8px rgba(0,0,0,.04);" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(180,83,9,.15)';this.style.borderColor='#b45309';" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='#e2e8f0';">
<div style="height:180px;overflow:hidden;position:relative;background:linear-gradient(135deg,#b45309 0%,#92400e 100%);">
<img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&auto=format&fit=crop" alt="Restaurant Receipts" style="width:100%;height:100%;object-fit:cover;opacity:.35;"/>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;">
<span style="font-size:40px;margin-bottom:8px;">&#127869;</span>
<span style="font-size:20px;font-weight:900;letter-spacing:-.02em;">Restaurant</span>
<span style="font-size:12px;opacity:.8;margin-top:2px;">6 templates</span>
</div>
</div>
<div style="padding:16px 18px;display:flex;justify-content:space-between;align-items:center;">
<div>
<div style="font-weight:800;font-size:15px;color:#0f172a;">Restaurant Templates</div>
<div style="font-size:12px;color:#94a3b8;margin-top:2px;">Diner, Fine Dining, Cafe &amp; more</div>
</div>
<div style="background:#fffbeb;color:#b45309;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;">Browse &rarr;</div>
</div>
</a>

<a href="/templates/?cat=services" style="display:block;border-radius:20px;overflow:hidden;border:2px solid #e2e8f0;background:#fff;text-decoration:none;transition:all .25s;box-shadow:0 2px 8px rgba(0,0,0,.04);" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(79,70,229,.15)';this.style.borderColor='#4f46e5';" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='#e2e8f0';">
<div style="height:180px;overflow:hidden;position:relative;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);">
<img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop" alt="Services Receipts" style="width:100%;height:100%;object-fit:cover;opacity:.35;"/>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;">
<span style="font-size:40px;margin-bottom:8px;">&#9889;</span>
<span style="font-size:20px;font-weight:900;letter-spacing:-.02em;">Services</span>
<span style="font-size:12px;opacity:.8;margin-top:2px;">6 templates</span>
</div>
</div>
<div style="padding:16px 18px;display:flex;justify-content:space-between;align-items:center;">
<div>
<div style="font-weight:800;font-size:15px;color:#0f172a;">Services Templates</div>
<div style="font-size:12px;color:#94a3b8;margin-top:2px;">Freelancer, Salon, Gym &amp; more</div>
</div>
<div style="background:#eef2ff;color:#4f46e5;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;">Browse &rarr;</div>
</div>
</a>

<a href="/templates/?cat=healthcare" style="display:block;border-radius:20px;overflow:hidden;border:2px solid #e2e8f0;background:#fff;text-decoration:none;transition:all .25s;box-shadow:0 2px 8px rgba(0,0,0,.04);" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(8,145,178,.15)';this.style.borderColor='#0891b2';" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='#e2e8f0';">
<div style="height:180px;overflow:hidden;position:relative;background:linear-gradient(135deg,#0891b2 0%,#0e7490 100%);">
<img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&auto=format&fit=crop" alt="Healthcare Receipts" style="width:100%;height:100%;object-fit:cover;opacity:.35;"/>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;">
<span style="font-size:40px;margin-bottom:8px;">&#127973;</span>
<span style="font-size:20px;font-weight:900;letter-spacing:-.02em;">Healthcare</span>
<span style="font-size:12px;opacity:.8;margin-top:2px;">5 templates</span>
</div>
</div>
<div style="padding:16px 18px;display:flex;justify-content:space-between;align-items:center;">
<div>
<div style="font-weight:800;font-size:15px;color:#0f172a;">Healthcare Templates</div>
<div style="font-size:12px;color:#94a3b8;margin-top:2px;">Clinic, Pharmacy, Dental &amp; more</div>
</div>
<div style="background:#ecfeff;color:#0891b2;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;">Browse &rarr;</div>
</div>
</a>

<a href="/templates/?cat=automotive" style="display:block;border-radius:20px;overflow:hidden;border:2px solid #e2e8f0;background:#fff;text-decoration:none;transition:all .25s;box-shadow:0 2px 8px rgba(0,0,0,.04);" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(185,28,28,.15)';this.style.borderColor='#b91c1c';" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='#e2e8f0';">
<div style="height:180px;overflow:hidden;position:relative;background:linear-gradient(135deg,#b91c1c 0%,#991b1b 100%);">
<img src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&q=80&auto=format&fit=crop" alt="Automotive Receipts" style="width:100%;height:100%;object-fit:cover;opacity:.35;"/>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;">
<span style="font-size:40px;margin-bottom:8px;">&#128663;</span>
<span style="font-size:20px;font-weight:900;letter-spacing:-.02em;">Automotive</span>
<span style="font-size:12px;opacity:.8;margin-top:2px;">5 templates</span>
</div>
</div>
<div style="padding:16px 18px;display:flex;justify-content:space-between;align-items:center;">
<div>
<div style="font-weight:800;font-size:15px;color:#0f172a;">Automotive Templates</div>
<div style="font-size:12px;color:#94a3b8;margin-top:2px;">Auto Repair, Gas, Parking &amp; more</div>
</div>
<div style="background:#fef2f2;color:#b91c1c;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;">Browse &rarr;</div>
</div>
</a>

<a href="/templates/?cat=hotel" style="display:block;border-radius:20px;overflow:hidden;border:2px solid #e2e8f0;background:#fff;text-decoration:none;transition:all .25s;box-shadow:0 2px 8px rgba(0,0,0,.04);" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(146,64,14,.15)';this.style.borderColor='#92400e';" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='#e2e8f0';">
<div style="height:180px;overflow:hidden;position:relative;background:linear-gradient(135deg,#92400e 0%,#78350f 100%);">
<img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop" alt="Hotel Receipts" style="width:100%;height:100%;object-fit:cover;opacity:.35;"/>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;">
<span style="font-size:40px;margin-bottom:8px;">&#127976;</span>
<span style="font-size:20px;font-weight:900;letter-spacing:-.02em;">Hotel</span>
<span style="font-size:12px;opacity:.8;margin-top:2px;">4 templates</span>
</div>
</div>
<div style="padding:16px 18px;display:flex;justify-content:space-between;align-items:center;">
<div>
<div style="font-weight:800;font-size:15px;color:#0f172a;">Hotel Templates</div>
<div style="font-size:12px;color:#94a3b8;margin-top:2px;">Hotel Folio, Resort, Rental &amp; more</div>
</div>
<div style="background:#fffbeb;color:#92400e;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;">Browse &rarr;</div>
</div>
</a>

<a href="/templates/?cat=travel" style="display:block;border-radius:20px;overflow:hidden;border:2px solid #e2e8f0;background:#fff;text-decoration:none;transition:all .25s;box-shadow:0 2px 8px rgba(0,0,0,.04);" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(14,165,233,.15)';this.style.borderColor='#0ea5e9';" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='#e2e8f0';">
<div style="height:180px;overflow:hidden;position:relative;background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);">
<img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80&auto=format&fit=crop" alt="Travel &amp; Tours Receipts" style="width:100%;height:100%;object-fit:cover;opacity:.35;"/>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;">
<span style="font-size:40px;margin-bottom:8px;">&#9992;</span>
<span style="font-size:20px;font-weight:900;letter-spacing:-.02em;">Travel &amp; Tours</span>
<span style="font-size:12px;opacity:.8;margin-top:2px;">1 template</span>
</div>
</div>
<div style="padding:16px 18px;display:flex;justify-content:space-between;align-items:center;">
<div>
<div style="font-weight:800;font-size:15px;color:#0f172a;">Travel &amp; Tours Templates</div>
<div style="font-size:12px;color:#94a3b8;margin-top:2px;">Travel Agency, Tour Packages &amp; more</div>
</div>
<div style="background:#e0f2fe;color:#0284c7;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;">Browse &rarr;</div>
</div>
</a>

</div>

<div style="text-align:center;margin-top:40px;">
<a href="/templates/" style="display:inline-flex;align-items:center;gap:8px;background:#4f46e5;color:#fff;padding:14px 32px;border-radius:999px;font-weight:800;font-size:15px;text-decoration:none;box-shadow:0 8px 24px rgba(79,70,229,.3);transition:all .2s;" onmouseover="this.style.background='#4338ca';this.style.transform='translateY(-2px)';" onmouseout="this.style.background='#4f46e5';this.style.transform='';">
View All 50+ Templates &rarr;
</a>
</div>
</div>
</section>`;

const before = html.substring(0, secStart);
const after = html.substring(secEnd);

const newHtml = before + newSection + after;
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('Done! Homepage templates section replaced. Length:', newHtml.length);
