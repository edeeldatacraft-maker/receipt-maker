const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');

function cleanDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            cleanDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            cleanFile(fullPath);
        }
    }
}

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove script preloads
    content = content.replace(/<link[^>]*as=["']script["'][^>]*>/gi, '');
    content = content.replace(/<link[^>]*as=["']script["'][^>]*\/>/gi, '');

    // 2. Remove script tags loading _next chunks (but keep application/ld+json!)
    content = content.replace(/<script[^>]*src=["']\/_next\/[^>]*><\/script>/gi, '');

    // 3. Remove inline self.__next_f hydration scripts at the bottom
    content = content.replace(/<script[^>]*>\(self\.__next_f=self\.__next_f\|\|\[\]\)[\s\S]*?<\/script>/gi, '');
    content = content.replace(/<script[^>]*>self\.__next_f[\s\S]*?<\/script>/gi, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned: ${filePath}`);
}

cleanDirectory(blogDir);
console.log('All blog pages cleaned successfully!');
