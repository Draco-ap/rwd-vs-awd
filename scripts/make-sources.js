// scripts/make-sources.js
// Genera 12 imágenes originales de 1600x1200 en scripts/source/<slug>.jpg
// Si prefieres fotos reales, omite este script y copia tus .jpg a scripts/source/
// con el nombre <slug>.jpg (ej. atlas-e1.jpg).
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const products = require('../data/products');

const OUT = path.join(__dirname, 'source');
const W = 1600;
const H = 1200;
const NOISE_SIGMA = 60; // sube = imágenes más pesadas, baja = más ligeras
const PALETTE = ['#1f6feb', '#8957e5', '#da3633', '#d29922', '#238636', '#0e8a8a',
                 '#bf4b8a', '#e3731e', '#4c8dff', '#6e7ee6', '#2da44e', '#c9511d'];

function buildSvg(p, i) {
  const color = PALETTE[i % PALETTE.length];
  const h = 150 * p.rackUnits;
  const y = (H - h) / 2;

  let bays = '';
  for (let b = 0; b < 8; b++) {
    bays += `<rect x="${260 + b * 95}" y="${y + 40}" width="80" height="${h - 80}" rx="8" fill="#0d1117" stroke="#444c56" stroke-width="3"/>
             <circle cx="${300 + b * 95}" cy="${y + h - 55}" r="7" fill="${color}"/>`;
  }
  let vents = '';
  for (let v = 0; v < 10; v++) {
    vents += `<rect x="${1060 + v * 30}" y="${y + 40}" width="14" height="${h - 80}" rx="7" fill="#0d1117"/>`;
  }

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0d1117" stop-opacity="0.65"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="200" y="${y}" width="1200" height="${h}" rx="16" fill="#1c2128" stroke="#8b949e" stroke-width="6"/>
  ${bays}
  ${vents}
  <text x="800" y="${y - 70}" font-family="Arial, sans-serif" font-size="84" font-weight="bold" fill="#ffffff" text-anchor="middle">${p.name}</text>
  <text x="800" y="${y + h + 100}" font-family="Arial, sans-serif" font-size="44" fill="#e6edf3" text-anchor="middle">${p.category} | ${p.cores} núcleos | ${p.ramGB} GB RAM</text>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const [i, p] of products.entries()) {
    // 1) Textura de ruido suavizado (se pasa por buffer PNG para garantizar el orden de operaciones)
    const texture = await sharp({
      create: { width: W, height: H, channels: 3,
                noise: { type: 'gaussian', mean: 128, sigma: NOISE_SIGMA } },
    }).blur(2).png({ compressionLevel: 1 }).toBuffer();

    // 2) Ilustración encima de la textura
    await sharp(texture)
      .composite([{ input: Buffer.from(buildSvg(p, i)), top: 0, left: 0 }])
      .jpeg({ quality: 90 })
      .toFile(path.join(OUT, `${p.slug}.jpg`));

    console.log(`✔ ${p.slug}.jpg`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });