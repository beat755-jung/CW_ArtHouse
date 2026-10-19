import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DPI = 100;
const JPEG_QUALITY = 85;
const ARTWORKS_DIR = 'public/artworks';

function getDirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) total += getDirSize(p);
    else total += fs.statSync(p).size;
  }
  return total;
}

let converted = 0, skipped = 0, errors = 0;
let savedBytes = 0;

async function processDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) { await processDir(fullPath); continue; }

    const ext = path.extname(entry.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    try {
      const meta = await sharp(fullPath).metadata();
      const density = meta.density || 72;

      if (density <= TARGET_DPI) {
        console.log(`  SKIP  ${entry.name} (${density} DPI, ${meta.width}x${meta.height})`);
        skipped++;
        continue;
      }

      const scale = TARGET_DPI / density;
      const newW = Math.round(meta.width * scale);
      const newH = Math.round(meta.height * scale);
      const origSize = fs.statSync(fullPath).size;
      const tmpPath = fullPath + '.converting';

      let pipeline = sharp(fullPath).resize(newW, newH);
      if (['.jpg', '.jpeg'].includes(ext)) {
        pipeline = pipeline.jpeg({ quality: JPEG_QUALITY });
      } else {
        pipeline = pipeline.png({ compressionLevel: 8 });
      }
      await pipeline.toFile(tmpPath);

      const newSize = fs.statSync(tmpPath).size;
      fs.unlinkSync(fullPath);
      fs.renameSync(tmpPath, fullPath);
      savedBytes += (origSize - newSize);
      converted++;

      console.log(`  DONE  ${entry.name}: ${meta.width}x${meta.height}@${density}dpi -> ${newW}x${newH}@100dpi | ${(origSize/1048576).toFixed(1)}MB -> ${(newSize/1048576).toFixed(1)}MB`);
    } catch (e) {
      console.error(`  ERROR ${entry.name}: ${e.message}`);
      errors++;
      // clean up temp if exists
      const tmpPath = fullPath + '.converting';
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  }
}

console.log('=== Artwork Image Resizer (target: 100 DPI, JPEG quality: 85) ===\n');
const sizeBefore = getDirSize(ARTWORKS_DIR);
console.log(`Before: ${(sizeBefore / 1073741824).toFixed(2)} GB\n`);

await processDir(ARTWORKS_DIR);

const sizeAfter = getDirSize(ARTWORKS_DIR);
console.log(`\n=== Summary ===`);
console.log(`Converted : ${converted} files`);
console.log(`Skipped   : ${skipped} files (already ≤ 100 DPI)`);
console.log(`Errors    : ${errors} files`);
console.log(`Before    : ${(sizeBefore / 1073741824).toFixed(2)} GB (${Math.round(sizeBefore/1048576)} MB)`);
console.log(`After     : ${(sizeAfter / 1073741824).toFixed(2)} GB (${Math.round(sizeAfter/1048576)} MB)`);
console.log(`Saved     : ${(savedBytes / 1073741824).toFixed(2)} GB (${Math.round(savedBytes/1048576)} MB, ${Math.round(savedBytes/sizeBefore*100)}%)`);
