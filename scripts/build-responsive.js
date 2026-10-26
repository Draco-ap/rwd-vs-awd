// scripts/build-responsive.js
// Genera public/responsive.html: UN solo HTML estático, idéntico para cualquier cliente.
// Úsalo con: npm run build:responsive  (vuelve a correrlo si cambias products.js)
const fs = require('fs');
const path = require('path');
const products = require('../data/products');

const WIDTHS = [320, 640, 960, 1600];
// Ancho real de la imagen en pantalla según el layout (le dice al navegador qué archivo elegir):
// desktop ~300px, tablet 2 columnas ~46vw, móvil miniatura de 128px.
const SIZES = '(min-width: 1025px) 300px, (min-width: 640px) 46vw, 128px';
const CATEGORIES = [...new Set(products.map((p) => p.category))];

const srcset = (slug, ext) => WIDTHS.map((w) => `/img/${slug}-${w}.${ext} ${w}w`).join(', ');
const usd = (n) => '$' + n.toLocaleString('en-US');

const card = (p) => `
      <article class="card" data-name="${p.name}" data-category="${p.category}" data-price="${p.price}" data-ram="${p.ramGB}" data-storage="${p.storageType}" data-power="${p.powerW}" data-score="${p.score}">
        <div class="card__media">
          <picture>
            <source type="image/avif" srcset="${srcset(p.slug, 'avif')}" sizes="${SIZES}">
            <source type="image/webp" srcset="${srcset(p.slug, 'webp')}" sizes="${SIZES}">
            <img src="/img/${p.slug}-640.jpg" srcset="${srcset(p.slug, 'jpg')}" sizes="${SIZES}" width="640" height="480" alt="${p.name} - ${p.category}" decoding="async">
          </picture>
        </div>
        <div class="card__body">
          <p class="card__cat">${p.category}</p>
          <h2 class="card__title">${p.name}</h2>
          <ul class="chips">${p.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
          <table class="specs">
            <tbody>
              ${Object.entries(p.specs).map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('\n              ')}
            </tbody>
          </table>
          <div class="card__foot">
            <span class="price">${usd(p.price)}</span>
            <button class="btn" type="button" data-buy>Comprar</button>
          </div>
        </div>
      </article>`;

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Catálogo de Servidores | Versión RWD</title>
    <link rel="icon" href="data:,">
  <link rel="stylesheet" href="/css/base.css">
  <link rel="stylesheet" href="/css/responsive.css">
  <script src="/vendor/chart.umd.js" defer></script>
  <script src="/js/responsive.js" defer></script>
</head>
<body>
  <header class="header">
    <a class="logo" href="/responsive">Rack<span>Lab</span></a>
    <nav class="nav" aria-label="Principal">
      <a href="#">Inicio</a>
      <a href="#">Servidores</a>
      <a href="#">Almacenamiento</a>
      <a href="#">Soporte</a>
    </nav>
    <span class="cart">Carrito: <strong id="cart-count">0</strong></span>
  </header>

  <div class="layout">
    <aside class="sidebar" id="filters" aria-label="Filtros y comparativa">
      <div class="sidebar__head">
        <h2>Filtros</h2>
        <button class="icon-btn" id="close-filters" type="button" aria-label="Cerrar filtros">✕</button>
      </div>

      <form id="filters-form">
        <fieldset>
          <legend>Categoría</legend>
          ${CATEGORIES.map((c) => `<label><input type="checkbox" name="cat" value="${c}" checked> ${c}</label>`).join('\n          ')}
        </fieldset>

        <label class="field">Almacenamiento
          <select name="storage">
            <option value="all">Todos</option>
            <option>NVMe</option>
            <option>SSD</option>
            <option>HDD</option>
          </select>
        </label>

        <label class="field">RAM mínima
          <select name="ram">
            <option value="0">Cualquiera</option>
            <option value="64">64 GB</option>
            <option value="256">256 GB</option>
            <option value="512">512 GB</option>
          </select>
        </label>

        <label class="field">Precio máximo: <output id="price-out">$80,000</output>
          <input type="range" name="price" min="1000" max="80000" step="1000" value="80000">
        </label>

        <button class="btn btn--ghost" type="reset">Limpiar filtros</button>
      </form>

      <section class="compare">
        <h2>Comparativa</h2>
        <label class="field">Métrica
          <select id="metric">
            <option value="score">Rendimiento</option>
            <option value="power">Consumo (W)</option>
            <option value="price">Precio (USD)</option>
          </select>
        </label>
        <div class="chart-box">
          <canvas id="chart" role="img" aria-label="Gráfico de barras que compara los productos visibles"></canvas>
        </div>
      </section>
    </aside>

    <main class="content">
      <div class="content__bar">
        <h1>Catálogo de servidores</h1>
        <p id="result-count" aria-live="polite">12 de 12 productos</p>
      </div>
      <div class="grid">${products.map(card).join('')}
      </div>
      <p id="empty" class="empty" hidden>Ningún producto coincide con los filtros.</p>
    </main>
  </div>

  <button class="btn fab" id="toggle-filters" type="button" aria-expanded="false" aria-controls="filters">Filtros y comparativa</button>
</body>
</html>
`;

const out = path.join(__dirname, '..', 'public', 'responsive.html');
fs.writeFileSync(out, html);
console.log(`✔ ${out} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);