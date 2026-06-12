/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const srcStatic = path.join(rootDir, '.next', 'static');
const destStatic = path.join(rootDir, '.next', 'standalone', '.next', 'static');

const srcPublic = path.join(rootDir, 'public');
const destPublic = path.join(rootDir, '.next', 'standalone', 'public');

function copyRecursive(src, dest) {
  try {
    if (!fs.existsSync(src)) {
      console.warn(`Source directory does not exist: ${src}`);
      return;
    }
    
    // Ensure destination parent directory exists
    const destParent = path.dirname(dest);
    if (!fs.existsSync(destParent)) {
      fs.mkdirSync(destParent, { recursive: true });
    }

    console.log(`Copying ${src} to ${dest}...`);
    
    // Node.js fs.cpSync is available from v16.7.0+
    if (typeof fs.cpSync === 'function') {
      fs.cpSync(src, dest, { recursive: true, force: true });
    } else {
      // Fallback recursive copy for older node versions
      const stat = fs.statSync(src);
      if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        for (const file of files) {
          copyRecursive(path.join(src, file), path.join(dest, file));
        }
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    console.log(`Successfully copied ${src}`);
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}:`, error);
    process.exit(1);
  }
}

// Perform copy operations
copyRecursive(srcStatic, destStatic);
copyRecursive(srcPublic, destPublic);

console.log('Postbuild asset copying completed successfully!');
