const fs = require('fs');
const path = require('path');

function searchDirectories(baseDir, depth = 0) {
    if (depth > 6) return;
    try {
        const files = fs.readdirSync(baseDir);
        for (const file of files) {
            if (file === 'node_modules' || file === 'AppData' || file.startsWith('.') || file === 'Windows' || file === 'System Volume Information' || file === '$RECYCLE.BIN') {
                continue;
            }
            const fullPath = path.join(baseDir, file);
            try {
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    const packagePath = path.join(fullPath, 'package.json');
                    if (fs.existsSync(packagePath)) {
                        try {
                            const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                            if (pkg.dependencies && (pkg.dependencies.next || pkg.dependencies.react)) {
                                console.log(`FOUND_PROJECT: ${fullPath} (name: ${pkg.name})`);
                            }
                        } catch (e) {
                            // Ignored JSON error
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

console.log('Searching D:\\ drive for any Next/React project...');
searchDirectories('D:\\');
console.log('Search finished.');
