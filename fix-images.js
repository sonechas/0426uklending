const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join('/Users/krishna/Documents/Websites/UKLending/src/assets');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));

async function processImages() {
  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      const metadata = await sharp(fullPath).metadata();
      // If it's huge, resize it to max width 1920 to save massive amounts of bandwidth
      let imagePipeline = sharp(fullPath);
      if (metadata.width > 1920) {
        imagePipeline = imagePipeline.resize({ width: 1920, withoutEnlargement: true });
      }
      
      // Force format to actual webp (fixing the fake ones)
      const buffer = await imagePipeline.webp({ quality: 80 }).toBuffer();
      
      fs.writeFileSync(fullPath, buffer);
      console.log(`Successfully fixed and resized ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }
}

processImages();
