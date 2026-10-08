const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://receipts-maker.com';
const ROOT_DIR = __dirname;

// Add your Google Analytics (GA4) ID here (e.g., 'G-XXXXXX') to auto-inject into all pages.
const GA_MEASUREMENT_ID = 'G-94F3DZ6LDW';

function getGoogleAnalyticsScript() {
  if (!GA_MEASUREMENT_ID) return '';
  return `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  </script>
  `;
}

const TEMPLATES = [
  // RETAIL
  {id:"walmart",name:"Walmart",cat:"retail",style:"thermal",color:"#0071CE",bg:"#EBF5FF",badge:"Retail",badgeColor:"#0071CE",desc:"Classic retail thermal receipt"},
  {id:"target",name:"Target",cat:"retail",style:"thermal",color:"#CC0000",bg:"#FFF5F5",badge:"Retail",badgeColor:"#CC0000",desc:"Bullseye retail style receipt"},
  {id:"costco",name:"Costco Wholesale",cat:"retail",style:"thermal",color:"#004F9E",bg:"#EFF6FF",badge:"Wholesale",badgeColor:"#004F9E",desc:"Wholesale club member receipt"},
  {id:"bestbuy",name:"Best Buy",cat:"retail",style:"thermal",color:"#003087",bg:"#FFFBE0",badge:"Electronics",badgeColor:"#003087",desc:"Electronics store customer receipt"},
  {id:"kroger",name:"Kroger Grocery",cat:"retail",style:"thermal",color:"#1B5E20",bg:"#F0FFF4",badge:"Grocery",badgeColor:"#1B5E20",desc:"Supermarket grocery itemized receipt"},
  {id:"cvs",name:"CVS Pharmacy",cat:"retail",style:"thermal",color:"#CC0000",bg:"#FFF5F5",badge:"Pharmacy",badgeColor:"#CC0000",desc:"Drug store customer receipt with barcode"},
  {id:"amazon",name:"Amazon Order",cat:"retail",style:"modern",color:"#FF9900",bg:"#FFFBF0",badge:"Online",badgeColor:"#FF9900",desc:"Online order confirmation receipt"},
  // RESTAURANT
  {id:"diner",name:"Classic Diner",cat:"restaurant",style:"thermal",color:"#B45309",bg:"#FFFBF0",badge:"Casual",badgeColor:"#B45309",desc:"American diner guest check"},
  {id:"fine_dining",name:"Fine Dining",cat:"restaurant",style:"elegant",color:"#1E293B",bg:"#F8FAFC",badge:"Fine Dining",badgeColor:"#1E293B",desc:"Upscale restaurant itemized bill"},
  {id:"cafe",name:"Cafe & Coffee",cat:"restaurant",style:"elegant",color:"#92400E",bg:"#FDF6EC",badge:"Cafe",badgeColor:"#92400E",desc:"Coffee shop customer receipt"},
  {id:"pizza",name:"Pizza & Fast Food",cat:"restaurant",style:"thermal",color:"#DC2626",bg:"#FFF5F5",badge:"Fast Food",badgeColor:"#DC2626",desc:"Fast food customer receipt"},
  {id:"sushi",name:"Asian Restaurant",cat:"restaurant",style:"elegant",color:"#BE123C",bg:"#FFF1F2",badge:"Asian",badgeColor:"#BE123C",desc:"Asian cuisine dining bill"},
  {id:"bakery",name:"Bakery & Desserts",cat:"restaurant",style:"elegant",color:"#B45309",bg:"#FFFBEB",badge:"Bakery",badgeColor:"#B45309",desc:"Bakery shop sales ticket"},
  // SERVICES
  {id:"freelancer",name:"Freelancer Pro",cat:"services",style:"modern",color:"#4F46E5",bg:"#EEF2FF",badge:"Professional",badgeColor:"#4F46E5",desc:"Professional service receipt"},
  {id:"salon",name:"Salon & Beauty",cat:"services",style:"elegant",color:"#BE185D",bg:"#FDF2F8",badge:"Beauty",badgeColor:"#BE185D",desc:"Beauty salon services invoice"},
  {id:"gym",name:"Gym & Fitness",cat:"services",style:"modern",color:"#0284C7",bg:"#F0F9FF",badge:"Fitness",badgeColor:"#0284C7",desc:"Fitness center membership fee receipt"},
  {id:"cleaning",name:"Home Cleaning",cat:"services",style:"modern",color:"#059669",bg:"#F0FDF4",badge:"Home",badgeColor:"#059669",desc:"Cleaning service payment receipt"},
  {id:"consulting",name:"Consulting",cat:"services",style:"dark",color:"#6D28D9",bg:"#0F172A",badge:"Business",badgeColor:"#6D28D9",desc:"Business consulting service bill"},
  {id:"plumber",name:"Plumber & Handyman",cat:"services",style:"modern",color:"#0369A1",bg:"#EFF6FF",badge:"Repairs",badgeColor:"#0369A1",desc:"Repair and maintenance invoice"},
  // HEALTHCARE
  {id:"clinic",name:"Medical Clinic",cat:"healthcare",style:"modern",color:"#0891B2",bg:"#ECFEFF",badge:"Medical",badgeColor:"#0891B2",desc:"Doctor clinic visit receipt"},
  {id:"pharmacy",name:"Pharmacy",cat:"healthcare",style:"modern",color:"#16A34A",bg:"#F0FDF4",badge:"Pharmacy",badgeColor:"#16A34A",desc:"Medicine purchase receipt"},
  {id:"dental",name:"Dental Clinic",cat:"healthcare",style:"modern",color:"#0284C7",bg:"#EFF6FF",badge:"Dental",badgeColor:"#0284C7",desc:"Dental care treatment invoice"},
  {id:"optician",name:"Eye Care & Optician",cat:"healthcare",style:"modern",color:"#7C3AED",bg:"#F5F3FF",badge:"Eye Care",badgeColor:"#7C3AED",desc:"Eye checkup and glasses sales receipt"},
  {id:"physio",name:"Physiotherapy",cat:"healthcare",style:"modern",color:"#0E7490",bg:"#ECFEFF",badge:"Therapy",badgeColor:"#0E7490",desc:"Physiotherapy session payment bill"},
  // AUTOMOTIVE
  {id:"garage",name:"Auto Repair Shop",cat:"automotive",style:"modern",color:"#B91C1C",bg:"#FEF2F2",badge:"Repair",badgeColor:"#B91C1C",desc:"Car repair service invoice"},
  {id:"carwash",name:"Car Wash",cat:"automotive",style:"modern",color:"#0284C7",bg:"#EFF6FF",badge:"Wash",badgeColor:"#0284C7",desc:"Car wash and detailing ticket"},
  {id:"fuel",name:"Gas Station",cat:"automotive",style:"thermal",color:"#D97706",bg:"#FFFBEB",badge:"Fuel",badgeColor:"#D97706",desc:"Petrol/Diesel fuel purchase receipt"},
  {id:"parking",name:"Parking Ticket",cat:"automotive",style:"thermal",color:"#374151",bg:"#F9FAFB",badge:"Parking",badgeColor:"#374151",desc:"Parking lot fee receipt"},
  {id:"tires",name:"Tire Shop",cat:"automotive",style:"modern",color:"#1E293B",bg:"#F8FAFC",badge:"Tires",badgeColor:"#1E293B",desc:"Tire replacement and alignment service"},
  // HOTEL
  {id:"hotel",name:"Hotel Folio",cat:"hotel",style:"elegant",color:"#92400E",bg:"#FFFBEB",badge:"Hotel",badgeColor:"#92400E",desc:"Hotel stay room charge folio"},
  {id:"vacation_rental",name:"Vacation Rental",cat:"hotel",style:"modern",color:"#E11D48",bg:"#FFF1F2",badge:"Rental",badgeColor:"#E11D48",desc:"Short-term vacation stay receipt"},
  {id:"resort",name:"Luxury Resort",cat:"hotel",style:"elegant",color:"#0284C7",bg:"#EFF6FF",badge:"Resort",badgeColor:"#0284C7",desc:"Resort and spa check-out bill"},
  {id:"hostel",name:"Hostel & Budget",cat:"hotel",style:"modern",color:"#7C3AED",bg:"#F5F3FF",badge:"Budget",badgeColor:"#7C3AED",desc:"Budget accommodation stay invoice"},
  // TRAVEL
  {id:"travel_tours",name:"Sultan Travel and Tours",cat:"travel",style:"elegant",color:"#0284C7",bg:"#EFF6FF",badge:"Travel",badgeColor:"#0284C7",desc:"Sultan travel agency services & tours receipt"},
];

const CATEGORIES = [
  { id: "retail", name: "Retail", emoji: "🛒", desc: "Walmart, Costco, CVS, Target and other supermarket and store receipt templates." },
  { id: "restaurant", name: "Restaurant", emoji: "🍽️", desc: "Cafe, Diner, Fine Dining, Bakery and fast food customer receipt templates." },
  { id: "services", name: "Services", emoji: "⚡", desc: "Freelancer, Consulting, Salon, Gym, Cleaning and plumbing services receipt templates." },
  { id: "healthcare", name: "Healthcare", emoji: "🏥", desc: "Medical Clinic, Pharmacy, Dental, Optician and physiotherapy session receipts." },
  { id: "automotive", name: "Automotive", emoji: "🚗", desc: "Auto Repair, Car Wash, Gas Station fuel, Parking ticket and tire shop receipts." },
  { id: "hotel", name: "Hotel", emoji: "🏨", desc: "Hotel Folio, Luxury Resort, Vacation Rental and hostel accommodation receipt templates." },
  { id: "travel", name: "Travel", emoji: "✈️", desc: "Travel agency, tour packages, ticket booking and vacation trip receipts." }
];

function getReceiptPreviewHTML(t) {
  if (t.style === "thermal") {
    return `
      <div class="receipt-thermal border border-slate-200 shadow-md max-w-sm w-full mx-auto" style="font-family:'Courier New',monospace; font-size:13px; line-height:1.5; color:#000; padding:28px 20px; background:#fff;">
        <div class="text-center mb-4">
          <div class="font-bold text-xl uppercase tracking-wider">${t.name.toUpperCase()}</div>
          <div class="text-xs text-slate-600">123 Business Rd, City, State</div>
          <div class="text-xs text-slate-600">Tel: (555) 123-4567</div>
        </div>
        <div class="border-b border-dashed border-slate-400 my-3"></div>
        <div class="flex justify-between text-xs my-1 text-slate-700">
          <span>Date: 2026-06-15</span>
          <span>Time: 12:30 PM</span>
        </div>
        <div class="flex justify-between text-xs my-1 text-slate-700">
          <span>Receipt #: ${t.id.toUpperCase()}-7492</span>
          <span>Cashier: Admin</span>
        </div>
        <div class="border-b border-dashed border-slate-400 my-3"></div>
        <table class="w-full text-xs text-left">
          <thead>
            <tr class="border-b border-dashed border-slate-400">
              <th class="pb-1 font-bold">Item Description</th>
              <th class="pb-1 text-center font-bold">Qty</th>
              <th class="pb-1 text-right font-bold">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="py-1">Standard Item / Service A</td>
              <td class="py-1 text-center">2</td>
              <td class="py-1 text-right">$45.00</td>
            </tr>
            <tr>
              <td class="py-1">Premium Product B</td>
              <td class="py-1 text-center">1</td>
              <td class="py-1 text-right">$29.99</td>
            </tr>
            <tr class="border-b border-dashed border-slate-400">
              <td class="py-1">Additional Fee C</td>
              <td class="py-1 text-center">1</td>
              <td class="py-1 text-right">$5.00</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between text-xs mt-3">
          <span>Subtotal</span>
          <span>$119.99</span>
        </div>
        <div class="flex justify-between text-xs my-1">
          <span>Tax (8%)</span>
          <span>$9.60</span>
        </div>
        <div class="flex justify-between text-sm font-bold border-t border-dashed border-slate-400 pt-2 mt-2">
          <span>TOTAL AMOUNT</span>
          <span>$129.59</span>
        </div>
        <div class="border-b border-dashed border-slate-400 my-3"></div>
        <div class="text-center text-xs italic text-slate-500 mt-2">
          Thank you for shopping at ${t.name}!<br/>
          Please come again.
        </div>
      </div>
    `;
  }
  if (t.style === "modern") {
    return `
      <div class="receipt-modern border border-slate-200 shadow-md max-w-sm w-full mx-auto bg-white rounded-xl overflow-hidden" style="font-family:inherit;">
        <div class="p-5 text-white" style="background:linear-gradient(135deg, ${t.color}, #6366f1);">
          <div class="text-lg font-black tracking-tight">${t.name}</div>
          <div class="text-xs opacity-80 mt-1">Receipt for Order #${t.id.toUpperCase()}-2026</div>
        </div>
        <div class="p-5 text-slate-600 text-xs">
          <div class="flex justify-between mb-4">
            <div>
              <p class="font-bold text-slate-900">Billed To:</p>
              <p>Valued Customer</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-900">Date:</p>
              <p>June 15, 2026</p>
            </div>
          </div>
          <div class="border-b border-slate-100 my-4"></div>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Professional Service / Consultation</span>
              <span class="font-bold text-slate-900">$150.00</span>
            </div>
            <div class="flex justify-between">
              <span>Standard Operations Setup</span>
              <span class="font-bold text-slate-900">$75.00</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Discount</span>
              <span>-$25.00</span>
            </div>
          </div>
          <div class="border-b border-slate-100 my-4"></div>
          <div class="flex justify-between text-sm font-bold text-slate-900">
            <span>Subtotal</span>
            <span>$200.00</span>
          </div>
          <div class="flex justify-between text-xs text-slate-500 my-1">
            <span>Estimated Tax (5%)</span>
            <span>$10.00</span>
          </div>
          <div class="flex justify-between text-base font-extrabold mt-3 pt-3 border-t border-slate-100" style="color:${t.color};">
            <span>Total Paid</span>
            <span>$210.00</span>
          </div>
        </div>
      </div>
    `;
  }
  if (t.style === "elegant") {
    return `
      <div class="receipt-elegant border border-slate-200 shadow-md max-w-sm w-full mx-auto bg-white p-6" style="border-left: 4px solid ${t.color}; font-family: Georgia, serif;">
        <div class="border-b-2 pb-3 mb-4" style="border-color:${t.color};">
          <h2 class="text-xl font-bold tracking-tight" style="color:${t.color};">${t.name}</h2>
          <p class="text-xs text-slate-500 italic mt-1">Receipt of Payment</p>
        </div>
        <div class="text-xs text-slate-600 space-y-2">
          <div class="flex justify-between">
            <span><strong>Receipt Number:</strong> #004829</span>
            <span><strong>Date:</strong> 15-Jun-2026</span>
          </div>
          <div class="border-b border-dashed my-3"></div>
          <div class="flex justify-between text-slate-800 font-semibold">
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div class="flex justify-between">
            <span>Room Reservation / Service Booking</span>
            <span>$180.00</span>
          </div>
          <div class="flex justify-between">
            <span>Dining / Room Service Charges</span>
            <span>$45.00</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Taxes & Service Fees</span>
            <span>$18.00</span>
          </div>
          <div class="border-t-2 pt-3 mt-3 flex justify-between text-sm font-bold" style="border-color:${t.color}; color:${t.color};">
            <span>GRAND TOTAL</span>
            <span>$243.00</span>
          </div>
        </div>
        <div class="text-center italic text-slate-500 text-xs mt-6" style="font-family: inherit;">
          Thank you for choosing ${t.name}!
        </div>
      </div>
    `;
  }
  if (t.style === "dark") {
    return `
      <div class="receipt-dark max-w-sm w-full mx-auto bg-slate-900 border border-slate-800 text-white rounded-xl p-6" style="font-family:inherit;">
        <div class="border-b border-slate-800 pb-4 mb-4 flex justify-between items-start">
          <div>
            <h2 class="text-lg font-bold text-slate-100">${t.name}</h2>
            <p class="text-xs text-slate-500">Business Services Receipt</p>
          </div>
          <div class="text-right">
            <span class="text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Paid</span>
          </div>
        </div>
        <div class="text-xs text-slate-400 space-y-3">
          <div class="flex justify-between">
            <span>Receipt #: INV-2026-94</span>
            <span>Date: Jun 15, 2026</span>
          </div>
          <div class="border-b border-slate-800 my-2"></div>
          <div class="flex justify-between text-slate-200 font-semibold">
            <span>Description</span>
            <span>Total</span>
          </div>
          <div class="flex justify-between">
            <span>Technical Advisory & Setup</span>
            <span class="text-slate-100 font-bold">$240.00</span>
          </div>
          <div class="flex justify-between">
            <span>Custom Logo Integration</span>
            <span class="text-slate-100 font-bold">$60.00</span>
          </div>
          <div class="flex justify-between">
            <span>Tax (10%)</span>
            <span>$30.00</span>
          </div>
          <div class="border-t border-slate-800 pt-3 mt-3 flex justify-between text-sm font-bold" style="color:${t.color || '#818cf8'};">
            <span>TOTAL AMOUNT</span>
            <span class="text-base font-extrabold">$330.00</span>
          </div>
        </div>
      </div>
    `;
  }
}

function getPageHTML(t) {
  const canonicalUrl = `${BASE_URL}/templates/${t.id}/`;
  const editUrl = `${BASE_URL}/receipt-maker/?template=${t.id}&tname=${encodeURIComponent(t.name)}&cat=${t.cat}`;
  
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Free ${t.name} Receipt Template | Online Receipt Generator</title>
  <meta name="description" content="Generate a realistic ${t.name} receipt online with our free template generator. Add custom items, logo, details, and download as PDF or image."/>
  <link rel="canonical" href="${canonicalUrl}"/>
  <link rel="stylesheet" href="/_next/static/css/4cdd78f5aa7f582e.css" data-precedence="next"/>
  <link rel="icon" href="/favicon.svg"/>
  ${getGoogleAnalyticsScript()}
  <script type="application/ld+json">

  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free ${t.name} Receipt Template",
    "description": "Customize and download a professional ${t.name} receipt instantly with our free receipt maker.",
    "url": "${canonicalUrl}"
  }
  </script>
</head>
<body class="__className_f367f3 bg-slate-50 text-slate-900 antialiased">
  <div class="min-h-screen bg-white flex flex-col font-sans">
    
    <!-- HEADER -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <a class="flex-shrink-0 flex items-center gap-2" href="/">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 shadow-lg shadow-indigo-500/20 rounded-xl">
              <rect x="3" y="2" width="18" height="20" rx="3" fill="url(#logo-gradient)"></rect>
              <path d="M7 6H17" stroke="white" stroke-width="2" stroke-linecap="round"></path>
              <path d="M7 10H17" stroke="white" stroke-width="2" stroke-linecap="round"></path>
              <path d="M7 14H13" stroke="white" stroke-width="2" stroke-linecap="round"></path>
              <circle cx="17" cy="16" r="3" fill="white" fill-opacity="0.2"></circle>
              <path d="M16 16L18 18" stroke="white" stroke-width="1.5" stroke-linecap="round"></path>
              <defs>
                <linearGradient id="logo-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#6366F1"></stop>
                  <stop offset="1" stop-color="#A855F7"></stop>
                </linearGradient>
              </defs>
            </svg>
            <span class="font-black text-xl tracking-tight text-slate-900">Receipt Maker</span>
          </a>
          <nav class="hidden md:flex items-center space-x-8">
            <a class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors" href="/#features">Features</a>
            <a class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors" href="/templates/">Templates</a>
            <a class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors" href="/privacy-policy/">Privacy Policy</a>
            <a class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors" href="/contact-us/">Contact Us</a>
            <a class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors" href="/blog/">Blog</a>
            <div class="flex items-center gap-4 border-l border-slate-200 pl-8">
              <a class="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors" href="/login/">Login</a>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- CONTENT -->
    <main class="flex-grow bg-slate-50 py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- BREADCRUMBS -->
        <nav class="flex text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <a href="/" class="hover:text-indigo-600">Home</a>
            </li>
            <li>
              <div class="flex items-center">
                <span class="mx-2">/</span>
                <a href="/templates/" class="hover:text-indigo-600">Templates</a>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <span class="mx-2">/</span>
                <a href="/templates/${t.cat}/" class="hover:text-indigo-600">${t.badge}</a>
              </div>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <span class="mx-2">/</span>
                <span class="text-slate-600 font-bold">${t.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- GRID -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT SIDE: INFO -->
          <div class="lg:col-span-7 space-y-6">
            <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <span class="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-wider mb-6 inline-block">${t.badge} Template</span>
              
              <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Free ${t.name} Receipt Template</h1>
              <p class="text-slate-600 leading-relaxed mb-6 font-medium">
                Need a professional receipt that looks like a real transaction slip from <strong>${t.name}</strong>? 
                Our free receipt generator has you covered. Whether you need to replace a lost receipt, keep business transaction records, or write proof of payment, this fully customizable template will make it look official in seconds.
              </p>

              <div class="space-y-4 border-t border-slate-100 pt-6">
                <h3 class="font-bold text-slate-900 text-lg">Template Specifications</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span class="text-xs text-slate-400 block font-bold uppercase tracking-wider">Template Style</span>
                    <span class="font-bold text-slate-700 capitalize">${t.style} Receipt</span>
                  </div>
                  <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span class="text-xs text-slate-400 block font-bold uppercase tracking-wider">Format</span>
                    <span class="font-bold text-slate-700">PDF, PNG &amp; JPG</span>
                  </div>
                  <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span class="text-xs text-slate-400 block font-bold uppercase tracking-wider">Custom Logo</span>
                    <span class="font-bold text-slate-700">Supported (JPG/PNG)</span>
                  </div>
                  <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span class="text-xs text-slate-400 block font-bold uppercase tracking-wider">Calculations</span>
                    <span class="font-bold text-slate-700">Automatic Tax &amp; Total</span>
                  </div>
                </div>
              </div>

              <!-- BUTTON CTA -->
              <div class="mt-8">
                <a href="${editUrl}" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4.5 px-8 rounded-2xl text-center block shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                  Customize &amp; Download ${t.name} Receipt
                </a>
              </div>
            </div>

            <!-- INSTRUCTIONS CARD -->
            <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
              <h2 class="text-2xl font-black text-slate-900 tracking-tight">How to Create a ${t.name} Receipt Online</h2>
              <p class="text-slate-600 text-sm">
                Follow these simple steps to make your own custom ${t.name} style receipt:
              </p>
              
              <ol class="space-y-4 text-sm text-slate-600 list-decimal pl-5">
                <li>
                  <strong>Open the Editor:</strong> Click the button above to load the ${t.name} template inside the online receipt maker.
                </li>
                <li>
                  <strong>Enter Store Details:</strong> Fill out the business name, address, phone number, and receipt code if needed.
                </li>
                <li>
                  <strong>Add Item Details:</strong> Enter the names, quantities, and prices for each product or service. The system will calculate subtotals and totals automatically.
                </li>
                <li>
                  <strong>Set Date &amp; Payment:</strong> Choose the transaction date, time, and how the invoice was paid (Cash, Card, bank transfer).
                </li>
                <li>
                  <strong>Export and Print:</strong> Click the "Generate" button, then choose to download as a high-quality PDF or export as an image.
                </li>
              </ol>
            </div>
          </div>

          <!-- RIGHT SIDE: PREVIEW -->
          <div class="lg:col-span-5 sticky top-24 space-y-4">
            <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h2 class="font-bold text-xs text-slate-400 uppercase tracking-widest text-center mb-5">Template Live Preview</h2>
              
              <div class="bg-slate-100 rounded-2xl p-6 flex items-center justify-center min-h-[300px]">
                ${getReceiptPreviewHTML(t)}
              </div>
              
              <p class="text-[11px] text-slate-400 text-center mt-4 italic">
                * Note: This is an interactive template preview. Click the edit button to insert your own details.
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-900 text-white py-8 text-center border-t border-slate-800">
      <p class="text-slate-400 text-sm">
        &copy; 2026 Receipt Maker. All rights reserved. &nbsp;|&nbsp;
        <a href="/privacy-policy/" class="hover:text-white transition-colors">Privacy</a> &nbsp;|&nbsp;
        <a href="/blog/" class="hover:text-white transition-colors">Blog</a> &nbsp;|&nbsp;
        <a href="/contact-us/" class="hover:text-white transition-colors">Contact</a>
      </p>
    </footer>

  </div>
</body>
</html>`;
}

// Generate the 33 static SEO template pages
TEMPLATES.forEach(t => {
  const dirPath = path.join(ROOT_DIR, 'templates', t.id);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, 'index.html');
  const fileContent = getPageHTML(t);
  
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`✓ Generated: templates/${t.id}/index.html`);
});

// Load raw base templates/index.html to create category pages
const baseTemplatesHTMLPath = path.join(ROOT_DIR, 'templates', 'index.html');
let baseTemplatesHTML = fs.readFileSync(baseTemplatesHTMLPath, 'utf8');

// Generate static category pages
CATEGORIES.forEach(cat => {
  const dirPath = path.join(ROOT_DIR, 'templates', cat.id);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Customize meta tags & canonicals specifically for the category page
  let catHtml = baseTemplatesHTML;
  
  // Replace title
  catHtml = catHtml.replace(
    /<title>[^<]*<\/title>/,
    `<title>Free ${cat.name} Receipt Templates | Online Receipt Maker</title>`
  );
  
  // Replace description
  catHtml = catHtml.replace(
    /<meta name="description" content="[^"]*"\/>/,
    `<meta name="description" content="Browse free ${cat.name} receipt templates. ${cat.desc} Select any template to edit and download instantly."/>`
  );
  
  // Replace canonical
  catHtml = catHtml.replace(
    /<link rel="canonical" href="[^"]*"\/>/,
    `<link rel="canonical" href="${BASE_URL}/templates/${cat.id}/"/>`
  );
  
  // Replace ld+json schema
  catHtml = catHtml.replace(
    /"@type":"WebPage","name":"Receipt Templates"[^}]*/,
    `"@type":"ItemPage","name":"${cat.name} Receipt Templates","description":"Browse and customize free ${cat.name} receipt templates.","url":"${BASE_URL}/templates/${cat.id}/"`
  );

  // Set the default loaded tab to this category inside the JS block
  // Replace window.location.search parsing to default to this category
  catHtml = catHtml.replace(
    /showCat\('all',\s*document\.querySelector\('\[data-cat="all"\]'\)\);/,
    `showCat('${cat.id}', document.querySelector('[data-cat="${cat.id}"]'));`
  );

  // Inject Google Analytics
  if (GA_MEASUREMENT_ID) {
    catHtml = catHtml.replace(
      '</head>',
      `${getGoogleAnalyticsScript()}</head>`
    );
  }

  const filePath = path.join(dirPath, 'index.html');
  fs.writeFileSync(filePath, catHtml, 'utf8');
  console.log(`✓ Generated Category Page: templates/${cat.id}/index.html`);
});


// GENERATE COMPREHENSIVE SITEMAP
console.log('\n--- Generating sitemap.xml ---');

// Define static core URLs
const sitemapUrls = [
  { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
  { loc: `${BASE_URL}/receipt-maker/`, changefreq: 'monthly', priority: '0.9' },
  { loc: `${BASE_URL}/templates/`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/contact-us/`, changefreq: 'monthly', priority: '0.5' },
  { loc: `${BASE_URL}/privacy-policy/`, changefreq: 'monthly', priority: '0.3' },
  { loc: `${BASE_URL}/terms-of-service/`, changefreq: 'monthly', priority: '0.3' },
  { loc: `${BASE_URL}/blog/`, changefreq: 'weekly', priority: '0.8' }
];

// Add static categories to sitemap
CATEGORIES.forEach(cat => {
  sitemapUrls.push({
    loc: `${BASE_URL}/templates/${cat.id}/`,
    changefreq: 'weekly',
    priority: '0.7'
  });
});

// Add 33 templates to sitemap
TEMPLATES.forEach(t => {
  sitemapUrls.push({
    loc: `${BASE_URL}/templates/${t.id}/`,
    changefreq: 'monthly',
    priority: '0.8'
  });
});

// Scan blog folder for posts dynamically
const blogDir = path.join(ROOT_DIR, 'blog');
if (fs.existsSync(blogDir)) {
  const items = fs.readdirSync(blogDir);
  items.forEach(item => {
    const itemPath = path.join(blogDir, item);
    // If it's a directory and contains index.html, it's a post
    if (fs.statSync(itemPath).isDirectory() && fs.existsSync(path.join(itemPath, 'index.html'))) {
      sitemapUrls.push({
        loc: `${BASE_URL}/blog/${item}/`,
        changefreq: 'monthly',
        priority: '0.6'
      });
    }
  });
}

// Format date YYYY-MM-DD
const todayStr = new Date().toISOString().split('T')[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
console.log('✓ Sitemap generated successfully with ' + sitemapUrls.length + ' URLs.');
