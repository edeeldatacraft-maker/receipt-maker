/**
 * fix-faq-no-main.js
 * Fixes templates that had no </main> tag — injects visible FAQ HTML before </body>
 */
const fs   = require('fs');
const path = require('path');

function buildFaqHtml(title, faqs) {
  const items = faqs.map((f, i) => `
    <details class="group bg-slate-50 rounded-2xl border border-slate-100" id="faq-item-${i + 1}">
      <summary class="flex items-center justify-between p-6 cursor-pointer text-slate-900 font-bold select-none group-hover:text-indigo-600 transition-colors">
        ${f.q}
        <span class="ml-6 flex-shrink-0 bg-white w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 group-open:-rotate-180 transition-transform duration-300 shadow-sm">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 text-slate-500">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </summary>
      <div class="px-6 pb-6 text-slate-600 leading-relaxed font-medium text-sm">${f.a}</div>
    </details>`).join('\n');

  return `
  <!-- FAQ Section -->
  <section class="py-16 bg-white border-t border-slate-100" id="faq">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">${title}</h2>
        <p class="text-base text-slate-600 font-medium">Everything you need to know about this template.</p>
      </div>
      <div class="space-y-4">
        ${items}
      </div>
    </div>
  </section>`;
}

// Only fix pages that are missing the FAQ HTML section
const fixes = [
  {
    dir: 'restaurant',
    faqTitle: 'Frequently Asked Questions — Restaurant Receipt Templates',
    faqs: [
      { q: "What types of restaurant receipts are available?", a: "We offer multiple restaurant receipt templates including fine dining, casual diner, cafe, pizza restaurant, sushi bar, and bakery styles to match your establishment's brand." },
      { q: "Can I add a tip line to the restaurant receipt?", a: "Yes! Our restaurant receipt templates include optional tip, gratuity, and service charge fields. You can enable or customize these to reflect your restaurant's billing policy." },
      { q: "How do I add my restaurant's logo to the receipt?", a: "Simply upload your restaurant logo using the logo uploader in the receipt editor. The logo will appear at the top of the receipt for professional branding." },
      { q: "Can I list food items and drinks separately on the receipt?", a: "Yes, you can add as many line items as you need, categorize them with custom descriptions, and set individual prices for food, beverages, and other charges." },
      { q: "Are the restaurant receipt templates customizable for different cuisines?", a: "Absolutely. You can customize the business name, address, cuisine type, menu items, and design elements to match any type of restaurant from fast food to fine dining." }
    ]
  },
  {
    dir: 'hotel',
    faqTitle: 'Frequently Asked Questions — Hotel Receipt Template',
    faqs: [
      { q: "What details can I include on a hotel receipt?", a: "You can include guest name, room number, check-in/check-out dates, nightly rate, taxes, additional charges (room service, minibar), and total amount due." },
      { q: "Is the hotel receipt template suitable for B&Bs and vacation rentals?", a: "Yes! The template works perfectly for bed and breakfasts, boutique hotels, vacation rentals, and hostels. Customize all fields to match your property." },
      { q: "Can I add multiple room charges or service items to the hotel receipt?", a: "Absolutely. Add as many line items as needed including room charges, spa services, restaurant bills, parking, and any other hotel amenities." },
      { q: "Can I download the hotel receipt as a PDF for guests?", a: "Yes, download your customized hotel receipt as a professional PDF to email or print for guests at checkout." },
      { q: "Does the hotel receipt support international currencies?", a: "Yes. You can set any currency symbol and adjust tax rates to comply with local regulations for properties worldwide." }
    ]
  },
  {
    dir: 'retail',
    faqTitle: 'Frequently Asked Questions — Retail Receipt Template',
    faqs: [
      { q: "What types of retail stores can use this receipt template?", a: "Our retail receipt template is suitable for clothing stores, electronics shops, grocery stores, boutiques, hardware stores, and any general merchandise retail business." },
      { q: "Can I add a return policy to the retail receipt?", a: "Yes, you can add a custom return policy message, store policy text, or any important notice at the bottom of the retail receipt for customer reference." },
      { q: "Does the retail receipt template support barcode or SKU numbers?", a: "Yes, you can include SKU numbers, item codes, or barcodes in the item description fields for detailed retail inventory tracking." },
      { q: "Can I apply discounts and coupons on the retail receipt?", a: "Absolutely. Add promotional discounts, coupon codes, member discounts, and sale prices as separate line items to show customers their full savings." },
      { q: "How many items can I add to the retail receipt?", a: "You can add unlimited line items to your retail receipt. The template automatically adjusts to accommodate as many products as needed." }
    ]
  }
];

for (const tpl of fixes) {
  const filePath = path.join(__dirname, 'templates', tpl.dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  if (html.includes('<!-- FAQ Section -->')) {
    console.log(`⏭️  ${tpl.dir}: FAQ HTML already present, skipped`);
    continue;
  }

  const faqHtml = buildFaqHtml(tpl.faqTitle, tpl.faqs);
  // Inject before </body> since no </main> exists
  html = html.replace('</body>', `${faqHtml}\n</body>`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ ${tpl.dir}: FAQ HTML section injected before </body>`);
}

console.log('\n✅ Fix complete!');
