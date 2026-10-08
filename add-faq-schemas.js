/**
 * add-faq-schemas.js
 * Adds FAQPage JSON-LD schema to:
 *   1. index.html (homepage) — converts existing static FAQ section to structured schema
 *   2. Top 10 template pages — injects custom FAQ schema + visible FAQ HTML section
 * Then re-generates hostinger-build-updated.zip
 */

const fs   = require('fs');
const path = require('path');

// ─── Helper ──────────────────────────────────────────────────────────────────

function readFile(p) { return fs.readFileSync(p, 'utf8'); }
function writeFile(p, content) { fs.writeFileSync(p, content, 'utf8'); }

/** Build a FAQPage JSON-LD <script> block */
function buildFaqSchema(faqs) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

/** Build an HTML FAQ accordion section to inject above </main> */
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

// ─── 1. Homepage FAQ Schema ───────────────────────────────────────────────────

const homepageFaqs = [
  {
    q: "Is the receipt generator completely free?",
    a: "Yes, our basic receipt generator is 100% free to use. You can generate and download standard receipts without paying anything."
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required to use our free templates. You can create, preview, and download your receipts instantly as a guest."
  },
  {
    q: "Can I add my own company logo?",
    a: "Absolutely! All our templates support custom logo uploads to ensure your receipts match your brand identity perfectly."
  },
  {
    q: "What formats can I download the receipt in?",
    a: "You can download your generated receipts as high-quality PDF files, or export them as image files (PNG/JPG) for easy sharing."
  },
  {
    q: "Are these receipts legally binding?",
    a: "Our templates include all standard fields required for business receipts. However, please consult with a legal professional for specific compliance requirements in your jurisdiction."
  },
  {
    q: "Can I save my receipt details for next time?",
    a: "While guest users can't save details, creating a free account allows you to save business info, items, and previous receipts for faster generation."
  }
];

const indexPath = path.join(__dirname, 'index.html');
let indexHtml = readFile(indexPath);

// Check if FAQPage schema already injected
if (!indexHtml.includes('"@type":"FAQPage"') && !indexHtml.includes('"@type": "FAQPage"')) {
  const faqSchemaBlock = buildFaqSchema(homepageFaqs);
  // Inject just before </head>
  indexHtml = indexHtml.replace('</head>', `${faqSchemaBlock}\n</head>`);
  writeFile(indexPath, indexHtml);
  console.log('✅ Homepage (index.html): FAQPage schema injected');
} else {
  console.log('⏭️  Homepage (index.html): FAQPage schema already present, skipped');
}

// ─── 2. Template Pages ────────────────────────────────────────────────────────

const templates = [
  {
    dir: 'walmart',
    name: 'Walmart Receipt',
    url: 'https://receipts-maker.com/templates/walmart/',
    faqTitle: 'Frequently Asked Questions — Walmart Receipt Template',
    faqs: [
      {
        q: "Can I use this template to create a fake Walmart receipt?",
        a: "Our Walmart receipt template is intended for legitimate personal and business record-keeping, practice, and educational purposes only. Creating fraudulent receipts for deception is illegal and unethical."
      },
      {
        q: "Does the Walmart receipt template match the real Walmart format?",
        a: "Yes, our template closely mirrors Walmart's standard receipt layout, including item descriptions, quantities, prices, tax, subtotal, and total fields for a realistic look."
      },
      {
        q: "Can I download the Walmart receipt as a PDF?",
        a: "Absolutely! After customizing your Walmart receipt template, you can download it as a high-quality PDF or PNG image instantly for free."
      },
      {
        q: "Do I need to sign up to use the Walmart receipt template?",
        a: "No sign-up is required. Simply open the template, fill in your details, and download — all completely free with no account needed."
      },
      {
        q: "Can I add tax and discount to my Walmart receipt?",
        a: "Yes, you can customize all fields including sales tax percentage, item discounts, payment method, and cashier name to create a realistic Walmart-style receipt."
      }
    ]
  },
  {
    dir: 'target',
    name: 'Target Receipt',
    url: 'https://receipts-maker.com/templates/target/',
    faqTitle: 'Frequently Asked Questions — Target Receipt Template',
    faqs: [
      {
        q: "Is the Target receipt template free to use?",
        a: "Yes! Our Target receipt template is completely free. You can customize and download it as a PDF or image without any cost or sign-up required."
      },
      {
        q: "How accurate is the Target receipt format?",
        a: "Our template closely replicates Target's official receipt style, including their red branding, item-by-item listing, tax calculation, and team member details."
      },
      {
        q: "Can I add a Target Circle discount to my receipt?",
        a: "Yes, you can add promotional discounts, Target Circle savings, and custom discount lines to your receipt to match real Target purchase receipts."
      },
      {
        q: "What file formats can I download the Target receipt in?",
        a: "You can export your customized Target receipt as a PDF for printing or as a PNG/JPG image for easy digital sharing."
      },
      {
        q: "Can I change the store location on the Target receipt template?",
        a: "Absolutely. You can customize the store name, address, city, state, zip code, phone number, and store ID to match any Target store location."
      }
    ]
  },
  {
    dir: 'restaurant',
    name: 'Restaurant Receipt',
    url: 'https://receipts-maker.com/templates/restaurant/',
    faqTitle: 'Frequently Asked Questions — Restaurant Receipt Templates',
    faqs: [
      {
        q: "What types of restaurant receipts are available?",
        a: "We offer multiple restaurant receipt templates including fine dining, casual diner, cafe, pizza restaurant, sushi bar, and bakery styles to match your establishment's brand."
      },
      {
        q: "Can I add a tip line to the restaurant receipt?",
        a: "Yes! Our restaurant receipt templates include optional tip, gratuity, and service charge fields. You can enable or customize these to reflect your restaurant's billing policy."
      },
      {
        q: "How do I add my restaurant's logo to the receipt?",
        a: "Simply upload your restaurant logo using the logo uploader in the receipt editor. The logo will appear at the top of the receipt for professional branding."
      },
      {
        q: "Can I list food items and drinks separately on the receipt?",
        a: "Yes, you can add as many line items as you need, categorize them with custom descriptions, and set individual prices for food, beverages, and other charges."
      },
      {
        q: "Are the restaurant receipt templates customizable for different cuisines?",
        a: "Absolutely. You can customize the business name, address, cuisine type, menu items, and design elements to match any type of restaurant from fast food to fine dining."
      }
    ]
  },
  {
    dir: 'cafe',
    name: 'Cafe Receipt',
    url: 'https://receipts-maker.com/templates/cafe/',
    faqTitle: 'Frequently Asked Questions — Cafe Receipt Template',
    faqs: [
      {
        q: "Is the cafe receipt template suitable for a coffee shop?",
        a: "Yes! Our cafe receipt template is designed for coffee shops, tea houses, bakery cafes, and similar establishments. You can customize drink orders, pastry items, and loyalty rewards."
      },
      {
        q: "Can I add a loyalty points section to the cafe receipt?",
        a: "Yes, you can add a custom loyalty points or rewards section to your cafe receipt, making it easy to show customers their accumulated points and next reward."
      },
      {
        q: "Can I customize the cafe name and logo on the receipt?",
        a: "Absolutely! The cafe receipt template supports full customization including your coffee shop's name, address, logo, barista name, and any custom message."
      },
      {
        q: "Does the cafe receipt template support itemized orders?",
        a: "Yes, you can list each drink or food item individually with quantity, customizations (like extra shot or oat milk), and price for a detailed, professional receipt."
      },
      {
        q: "Can I download the cafe receipt as a PDF for printing?",
        a: "Yes. Once you've customized your cafe receipt, download it instantly as a print-ready PDF or as a PNG/JPG image to share digitally with customers."
      }
    ]
  },
  {
    dir: 'freelancer',
    name: 'Freelancer Receipt',
    url: 'https://receipts-maker.com/templates/freelancer/',
    faqTitle: 'Frequently Asked Questions — Freelancer Receipt Template',
    faqs: [
      {
        q: "Can freelancers use this receipt template for client billing?",
        a: "Absolutely! Our freelancer receipt template is specifically designed for independent contractors and self-employed professionals to issue payment receipts to clients for completed projects."
      },
      {
        q: "Can I include my hourly rate on the freelancer receipt?",
        a: "Yes. The freelancer receipt template supports hourly rate billing. You can list hours worked, hourly rate, and calculated total alongside project descriptions and deliverables."
      },
      {
        q: "Is the freelancer receipt template suitable for international clients?",
        a: "Yes! You can customize the currency symbol, tax rates, business address, and client details to accommodate clients from any country."
      },
      {
        q: "Can I add payment method details to the freelancer receipt?",
        a: "Yes, you can include payment method information such as PayPal, bank transfer, credit card, or check, along with a transaction ID or reference number."
      },
      {
        q: "How do I add my freelance business name and logo to the receipt?",
        a: "Simply enter your freelance brand name, address, and upload your logo in the receipt editor. This creates a professional, branded receipt that builds client trust."
      }
    ]
  },
  {
    dir: 'hotel',
    name: 'Hotel Receipt',
    url: 'https://receipts-maker.com/templates/hotel/',
    faqTitle: 'Frequently Asked Questions — Hotel Receipt Template',
    faqs: [
      {
        q: "What details can I include on a hotel receipt?",
        a: "You can include guest name, room number, check-in/check-out dates, nightly rate, taxes, additional charges (room service, minibar), and total amount due."
      },
      {
        q: "Is the hotel receipt template suitable for B&Bs and vacation rentals?",
        a: "Yes! The template works perfectly for bed and breakfasts, boutique hotels, vacation rentals, and hostels. Customize all fields to match your property."
      },
      {
        q: "Can I add multiple room charges or service items to the hotel receipt?",
        a: "Absolutely. Add as many line items as needed including room charges, spa services, restaurant bills, parking, and any other hotel amenities."
      },
      {
        q: "Can I download the hotel receipt as a PDF for guests?",
        a: "Yes, download your customized hotel receipt as a professional PDF to email or print for guests at checkout."
      },
      {
        q: "Does the hotel receipt support international currencies?",
        a: "Yes. You can set any currency symbol and adjust tax rates to comply with local regulations for properties worldwide."
      }
    ]
  },
  {
    dir: 'gym',
    name: 'Gym Receipt',
    url: 'https://receipts-maker.com/templates/gym/',
    faqTitle: 'Frequently Asked Questions — Gym Receipt Template',
    faqs: [
      {
        q: "Can I use this template for gym membership payments?",
        a: "Yes! Our gym receipt template is perfect for issuing payment receipts for monthly memberships, personal training sessions, class packages, and day passes."
      },
      {
        q: "Can I include the membership period on the gym receipt?",
        a: "Absolutely. Add the membership start date, end date, membership tier, and renewal date so members have a complete record of their subscription."
      },
      {
        q: "Does the gym receipt template support multiple services?",
        a: "Yes, you can list multiple gym services including membership fees, personal training, nutrition plans, locker rental, and supplement purchases as separate line items."
      },
      {
        q: "Can I add my gym's logo and branding to the receipt?",
        a: "Yes. Upload your gym's logo, set your brand colors, and add your facility address for a professional, branded member receipt."
      },
      {
        q: "Is the gym receipt template free to download?",
        a: "Yes, our gym receipt template is completely free. Customize it and download as a PDF or image with no sign-up required."
      }
    ]
  },
  {
    dir: 'salon',
    name: 'Salon Receipt',
    url: 'https://receipts-maker.com/templates/salon/',
    faqTitle: 'Frequently Asked Questions — Salon Receipt Template',
    faqs: [
      {
        q: "Can I use this receipt template for a hair salon?",
        a: "Yes! Our salon receipt template is designed for hair salons, nail salons, beauty spas, and barbershops to issue professional payment receipts to clients."
      },
      {
        q: "Can I list individual services like haircut, color, and blowout separately?",
        a: "Absolutely. Add each salon service as a separate line item with the service name, stylist, duration, and price for a detailed and transparent receipt."
      },
      {
        q: "Can I include tip amounts on the salon receipt?",
        a: "Yes, the salon receipt template includes a tip field so clients can see their gratuity amount recorded alongside service charges on their receipt."
      },
      {
        q: "How do I add my salon's brand and logo?",
        a: "Simply upload your salon's logo in the editor, enter your business name, address, and phone number to create a fully branded salon receipt."
      },
      {
        q: "Can I add product purchases to the salon receipt?",
        a: "Yes, you can include retail product sales such as shampoo, conditioner, or styling products as additional line items alongside service charges."
      }
    ]
  },
  {
    dir: 'pharmacy',
    name: 'Pharmacy Receipt',
    url: 'https://receipts-maker.com/templates/pharmacy/',
    faqTitle: 'Frequently Asked Questions — Pharmacy Receipt Template',
    faqs: [
      {
        q: "Can I use this template for prescription pharmacy receipts?",
        a: "Yes! Our pharmacy receipt template supports prescription medication entries, over-the-counter products, insurance co-pays, and pharmacy details for professional medical receipts."
      },
      {
        q: "Can I add insurance and co-pay information to the pharmacy receipt?",
        a: "Yes, you can include insurance details, plan name, co-pay amount, and patient responsibility fields to create a complete pharmacy payment receipt."
      },
      {
        q: "Is the pharmacy receipt template HIPAA compliant?",
        a: "Our templates are designed for record-keeping and documentation. However, please ensure your specific use case meets all applicable privacy and healthcare regulations."
      },
      {
        q: "Can I list multiple medications or products on the pharmacy receipt?",
        a: "Yes, add as many medication or product line items as needed, with quantities, prices, and prescription details for each item."
      },
      {
        q: "Can I download the pharmacy receipt as a PDF?",
        a: "Yes, download your completed pharmacy receipt as a PDF for printing or digital storage, or as a PNG/JPG image for easy sharing."
      }
    ]
  },
  {
    dir: 'retail',
    name: 'Retail Receipt',
    url: 'https://receipts-maker.com/templates/retail/',
    faqTitle: 'Frequently Asked Questions — Retail Receipt Template',
    faqs: [
      {
        q: "What types of retail stores can use this receipt template?",
        a: "Our retail receipt template is suitable for clothing stores, electronics shops, grocery stores, boutiques, hardware stores, and any general merchandise retail business."
      },
      {
        q: "Can I add a return policy to the retail receipt?",
        a: "Yes, you can add a custom return policy message, store policy text, or any important notice at the bottom of the retail receipt for customer reference."
      },
      {
        q: "Does the retail receipt template support barcode or SKU numbers?",
        a: "Yes, you can include SKU numbers, item codes, or barcodes in the item description fields for detailed retail inventory tracking."
      },
      {
        q: "Can I apply discounts and coupons on the retail receipt?",
        a: "Absolutely. Add promotional discounts, coupon codes, member discounts, and sale prices as separate line items to show customers their full savings."
      },
      {
        q: "How many items can I add to the retail receipt?",
        a: "You can add unlimited line items to your retail receipt. The template automatically adjusts to accommodate as many products as needed."
      }
    ]
  }
];

// ─── Process each template ────────────────────────────────────────────────────

let processed = 0;
let skipped = 0;
const errors = [];

for (const tpl of templates) {
  const filePath = path.join(__dirname, 'templates', tpl.dir, 'index.html');

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Template not found: templates/${tpl.dir}/index.html — skipping`);
    errors.push(tpl.dir);
    continue;
  }

  let html = readFile(filePath);

  // ── 2a. Inject/replace JSON-LD schema in <head> ──────────────────────────
  const faqSchemaTag = buildFaqSchema(tpl.faqs);

  if (html.includes('"@type":"FAQPage"') || html.includes('"@type": "FAQPage"')) {
    console.log(`⏭️  ${tpl.dir}: FAQPage schema already present, schema skipped`);
  } else {
    // Replace existing WebPage/ItemPage schema with combined version
    // Keep existing schema, add FAQPage schema after it
    html = html.replace('</head>', `\n  ${faqSchemaTag}\n</head>`);
    console.log(`✅ ${tpl.dir}: FAQPage JSON-LD schema injected into <head>`);
  }

  // ── 2b. Inject visible FAQ HTML section before </main> ───────────────────
  if (html.includes('<!-- FAQ Section -->')) {
    console.log(`⏭️  ${tpl.dir}: FAQ HTML section already present, HTML skipped`);
  } else {
    const faqHtml = buildFaqHtml(tpl.faqTitle, tpl.faqs);
    html = html.replace('</main>', `${faqHtml}\n  </main>`);
    console.log(`✅ ${tpl.dir}: FAQ HTML section injected before </main>`);
  }

  writeFile(filePath, html);
  processed++;
}

console.log(`\n📊 Summary: ${processed} templates updated, ${skipped} skipped, ${errors.length} errors`);
if (errors.length) console.log('   Errors:', errors.join(', '));

// ─── 3. Verify schemas are valid JSON ─────────────────────────────────────────

console.log('\n🔍 Verifying JSON-LD schemas...');

// Verify homepage
const homeVerify = readFile(indexPath);
const homeMatch = homeVerify.match(/application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
let homeValid = 0;
for (const block of homeMatch) {
  try {
    const json = block.replace(/<script[^>]*>/, '').replace('</script>', '').trim();
    const parsed = JSON.parse(json);
    if (parsed['@type'] === 'FAQPage') {
      console.log(`✅ Homepage FAQPage schema valid — ${parsed.mainEntity.length} questions`);
      homeValid++;
    }
  } catch(e) {
    console.error('❌ Homepage: Invalid JSON in ld+json block:', e.message);
  }
}
if (!homeValid) console.warn('⚠️  Homepage: No FAQPage schema block found or parseable');

// Verify templates
for (const tpl of templates) {
  const filePath = path.join(__dirname, 'templates', tpl.dir, 'index.html');
  if (!fs.existsSync(filePath)) continue;
  const html = readFile(filePath);
  const blocks = html.match(/application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  let found = false;
  for (const block of blocks) {
    try {
      const json = block.replace(/<script[^>]*>/, '').replace('</script>', '').trim();
      const parsed = JSON.parse(json);
      if (parsed['@type'] === 'FAQPage') {
        console.log(`✅ ${tpl.dir}: FAQPage schema valid — ${parsed.mainEntity.length} questions`);
        found = true;
      }
    } catch(e) {
      console.error(`❌ ${tpl.dir}: Invalid JSON in ld+json block:`, e.message);
    }
  }
  if (!found) console.warn(`⚠️  ${tpl.dir}: No valid FAQPage schema found`);
}

console.log('\n✅ FAQ schema injection complete!');
