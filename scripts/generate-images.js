// scripts/generate-images.js
// Lee scripts/source/<slug>.jpg y genera en public/img/ las variantes
// <slug>-<ancho>.jpg|webp|avif para los anchos definidos en WIDTHS.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const products = require('../data/products');

const SRC = path.join(__dirname, 'source');
const OUT = path.join(__dirname, '..', 'public', 'img');
const WIDTHS = [320, 640, 960, 1600];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const p of products) {
    const src = path.join(SRC, `${p.slug}.jpg`);
    if (!fs.existsSync(src)) {
      console.warn(`⚠ Falta ${src}, se omite`);
      continue;
    }
    for (const w of WIDTHS) {
      const base = sharp(src).resize({ width: w, withoutEnlargement: true });
      const name = path.join(OUT, `${p.slug}-${w}`);
      await base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${name}.jpg`);
      await base.clone().webp({ quality: 75 }).toFile(`${name}.webp`);
      await base.clone().avif({ quality: 50 }).toFile(`${name}.avif`);
    }
    console.log(`✔ ${p.slug}`);
  }

  // Resumen de peso por formato (útil para el reporte)
  const totals = {};
  for (const f of fs.readdirSync(OUT)) {
    const ext = path.extname(f).slice(1);
    totals[ext] = (totals[ext] || 0) + fs.statSync(path.join(OUT, f)).size;
  }
  console.table(Object.entries(totals).map(([formato, bytes]) => ({
    formato, MB: (bytes / 1048576).toFixed(2),
  })));
}

main().catch((e) => { console.error(e); process.exit(1); });