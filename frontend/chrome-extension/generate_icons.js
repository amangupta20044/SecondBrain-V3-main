import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal 1x1 transparent PNG base64 representation
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(base64Png, 'base64');

const assetsDir = path.join(__dirname, 'src/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

[16, 32, 48, 128].forEach((size) => {
  const iconPath = path.join(assetsDir, `icon${size}.png`);
  fs.writeFileSync(iconPath, pngBuffer);
  console.log(`Created ${iconPath}`);
});
