const fs = require('fs');
const path = require('path');

function searchDirectories(baseDir, depth = 0) {
    if (depth > 5) return; // Limit depth to prevent infinitely deep search
    try {
        const files = fs.readdirSync(baseDir);
        for (const file of files) {
            if (file === 'node_modules' || file === 'AppData' || file.startsWith('.') || file === 'Windows' || file === 'Program Files' || file === 'Program Files (x86)' || file === 'xampp' || file === 'System Volume Information') {
                continue;
            }
            const fullPath = path.join(baseDir, file);
            try {
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    const packagePath = path.join(fullPath, 'package.json');
                    if (fs.existsSync(packagePath)) {
                        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                        if (pkg.dependencies && (pkg.dependencies.next || pkg.dependencies.react)) {
                            console.log(`FOUND_PROJECT: ${fullPath} (name: ${pkg.name})`);
                        }
                    }
                    searchDirectories(fullPath, depth + 1);
                }
            } catch (e) {
                // Ignore
            }
        }
    } catch (e) {
        // Ignore
    }
}

console.log('Searching C:\\Users\\Hamada Salim G Trd for any Next/React project...');
searchDirectories('C:\\Users\\Hamada Salim G Trd');
console.log('Search finished.');
