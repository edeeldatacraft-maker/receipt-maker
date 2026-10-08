const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Strip out Next.js hydration scripts to prevent it from replacing our manually added HTML
html = html.replace(/<script src="\/_next\/static\/chunks\/[^>]+><\/script>/g, '');
// Strip out next app scripts
html = html.replace(/<script src="\/_next\/static\/[^>]+><\/script>/g, '');
html = html.replace(/<script src="\/_next\/static\/[^>]+" async=""><\/script>/g, '');

fs.writeFileSync('index.html', html);
console.log('Cleaned index.html of Next.js hydration scripts.');
