// server.js
const express = require('express');
const path = require('path');
const useragent = require('express-useragent');
const products = require('./data/products');
const detectDevice = require('./middleware/device');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const CATEGORIES = [...new Set(products.map((p) => p.category))];
const usd = (n) => '$' + n.toLocaleString('en-US');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos (css, js, img, vendor), con la misma configuración para RWD y AWD
app.use(express.static(PUBLIC, { index: false }));

// ===== Versión A: RWD. El MISMO archivo HTML para cualquier cliente =====
app.get('/responsive', (req, res) => {
  res.sendFile(path.join(PUBLIC, 'responsive.html'));
});

// ===== Versión B: AWD. El servidor inspecciona la petición y arma un DOM distinto =====
app.get('/adaptive', useragent.express(), detectDevice, (req, res, next) => {
  const { type, ext, width } = req.device;
  const t0 = process.hrtime.bigint();

  res.render(type, {
    products,
    categories: CATEGORIES,
    usd,
    img: (slug) => `/img/${slug}-${width}.${ext}`,
    imgW: width,
    imgH: Math.round((width * 3) / 4),
  }, (err, html) => {
    if (err) return next(err);
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    console.log(`[adaptive] ${type} | ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB | render ${ms.toFixed(1)} ms | .${ext} ${width}px`);
    res.send(html);
  });
});

app.get('/', (req, res) => res.redirect('/responsive'));

app.listen(PORT, () => console.log(`Servidor listo: http://localhost:${PORT}/responsive y /adaptive`));