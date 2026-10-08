const fs = require('fs');
const path = require('path');

function searchDirectories(baseDir) {
    try {
        const files = fs.readdirSync(baseDir);
        for (const file of files) {
            if (file === 'node_modules' || file === 'AppData' || file.startsWith('.') || file === 'Windows' || file === 'Program Files' || file === 'Program Files (x86)' || file === 'xampp') {
                continue;
            }
            const fullPath = path.join(baseDir, file);
            try {
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    // Check if it contains package.json and next.config.js or next.config.mjs
                    const hasPackageJson = fs.existsSync(path.join(fullPath, 'package.json'));
                    const hasNextConfig = fs.existsSync(path.join(fullPath, 'next.config.js')) || fs.existsSync(path.join(fullPath, 'next.config.mjs'));
                    if (hasPackageJson && hasNextConfig) {
                        console.log(`FOUND_NEXTJS_PROJECT: ${fullPath}`);
                    }
                    searchDirectories(fullPath);
                }
            } catch (e) {
                // Ignore permission errors
            }
        }
    } catch (e) {
        // Ignore permission errors
    }
}

console.log('Searching C:\\ drive for Next.js source projects...');
searchDirectories('C:\\');
console.log('Search finished.');
