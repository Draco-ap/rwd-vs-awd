// scripts/check-sizes.js
// Compara el HTML recibido por un cliente móvil y uno desktop en ambas versiones.
// Requiere el servidor corriendo (npm start en otra terminal). Node 18+.
const BASE = process.env.BASE || 'http://localhost:3000';
const UA = {
  mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
};
const ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8';
const kb = (b) => (b / 1024).toFixed(1) + ' KB';

async function get(route, ua) {
  const res = await fetch(BASE + route, { headers: { 'User-Agent': ua, Accept: ACCEPT } });
  if (!res.ok) throw new Error(`${route} respondió ${res.status}`);
  const html = await res.text();
  return { html, bytes: Buffer.byteLength(html), device: res.headers.get('x-device-class') || '-' };
}

async function main() {
  const rwdMobile = await get('/responsive', UA.mobile);
  const rwdDesktop = await get('/responsive', UA.desktop);
  const awdMobile = await get('/adaptive', UA.mobile);
  const awdDesktop = await get('/adaptive', UA.desktop);

  console.table([
    { version: 'RWD', cliente: 'móvil', clase: rwdMobile.device, tamaño: kb(rwdMobile.bytes) },
    { version: 'RWD', cliente: 'desktop', clase: rwdDesktop.device, tamaño: kb(rwdDesktop.bytes) },
    { version: 'AWD', cliente: 'móvil', clase: awdMobile.device, tamaño: kb(awdMobile.bytes) },
    { version: 'AWD', cliente: 'desktop', clase: awdDesktop.device, tamaño: kb(awdDesktop.bytes) },
  ]);

  const pct = (a, b) => (((a - b) / b) * 100).toFixed(1) + ' %';
  console.log(`AWD móvil vs AWD desktop: ${pct(awdMobile.bytes, awdDesktop.bytes)}`);
  console.log(`AWD móvil vs RWD móvil (fila 1 de tu tabla): ${pct(awdMobile.bytes, rwdMobile.bytes)}\n`);

  const m = awdMobile.html;
  const checks = [
    ['El servidor clasificó al cliente móvil como "mobile"', awdMobile.device === 'mobile'],
    ['El servidor clasificó al cliente desktop como "desktop"', awdDesktop.device === 'desktop'],
    ['HTML móvil AWD sin <canvas> (gráfico)', !/<canvas/.test(m)],
    ['HTML móvil AWD sin referencia a Chart.js', !/chart\.umd/.test(m)],
    ['HTML móvil AWD sin tabla de specs', !/class="specs"/.test(m) && !m.includes('Gestión remota')],
    ['HTML móvil AWD pesa menos que el de desktop', awdMobile.bytes < awdDesktop.bytes],
    ['El RWD envía el mismo HTML a móvil y desktop', rwdMobile.html === rwdDesktop.html],
  ];
  let ok = true;
  for (const [label, pass] of checks) {
    console.log(`${pass ? '✔' : '✘'} ${label}`);
    ok = ok && pass;
  }
  process.exit(ok ? 0 : 1);
}

main().catch((e) => { console.error('Error:', e.message, '\n¿Está corriendo npm start?'); process.exit(1); });