const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find the entire templates section (from section start to section end)
// The section starts just before "Choose a template to generate your receipt"
const sectionStart = html.indexOf('<section id=\\"templates\\"');
let templateStart = -1;
let templateEnd = -1;

// Try different patterns to find the section
const patterns = [
  'jsx-bd5e47cd380d74ca py-24 bg-white"><div class="jsx-bd5e47cd380d74ca max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="jsx-bd5e47cd380d74ca text-center max-w-3xl mx-auto mb-16"><h2 class="jsx-bd5e47cd380d74ca text-3xl md:text-4xl font-bold text-slate-900 mb-4">Choose a template to generate your receipt</h2>',
];

// Find section containing "Choose a template"
const marker = 'Choose a template to generate your receipt';
const markerPos = html.indexOf(marker);
console.log('Marker found at:', markerPos);

// Go backwards to find the section opening tag
let secStart = markerPos;
while (secStart > 0 && html.substring(secStart-8, secStart) !== '<section') {
  secStart--;
}
secStart -= 7; // include the <section

// Find the closing </section> tag after the templates grid
// The next section is the features section
const featuresMarker = 'Everything you need to create';
const featuresPos = html.indexOf(featuresMarker);
let secEnd = featuresPos;
// go backwards to find the </section> before features
while (secEnd > 0 && html.substring(secEnd-10, secEnd) !== '</section>') {
  secEnd--;
}
// secEnd now points to after </section>

console.log('Section start:', secStart);
console.log('Section end:', secEnd);
console.log('Section preview start:', html.substring(secStart, secStart+100));
console.log('Section preview end:', html.substring(secEnd-20, secEnd+20));
