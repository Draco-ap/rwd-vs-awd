// middleware/device.js
// Detección de contexto en servidor para la versión AWD.
// A partir de las cabeceras HTTP de la petición decide tres cosas:
//   1) clase de dispositivo (mobile | desktop) -> User-Agent, vía express-useragent
//   2) formato de imagen (avif | webp | jpg)   -> cabecera Accept
//   3) ancho de imagen fijo para esa clase     -> constantes de abajo

const MOBILE_IMG_WIDTH = 320;   // miniatura de 128 px CSS (puedes probar 640 para comparar)
const DESKTOP_IMG_WIDTH = 640;  // tarjeta de ~300 px CSS

function pickFormat(accept = '') {
  if (accept.includes('image/avif')) return 'avif';
  if (accept.includes('image/webp')) return 'webp';
  return 'jpg';
}

module.exports = function detectDevice(req, res, next) {
  const ua = req.useragent || {};

  // Solo para depuración: /adaptive?device=mobile fuerza la clase
  const forced = ['mobile', 'desktop'].includes(req.query.device) ? req.query.device : null;

  // Decisión de diseño: móviles y tablets reciben la vista ligera
  const isMobile = forced
    ? forced === 'mobile'
    : Boolean(ua.isMobile || ua.isTablet || ua.isiPad);
  const type = isMobile ? 'mobile' : 'desktop';

  req.device = {
    type,
    ext: pickFormat(req.headers.accept),
    width: isMobile ? MOBILE_IMG_WIDTH : DESKTOP_IMG_WIDTH,
  };

  // La respuesta cambia según estas cabeceras: las cachés y CDN deben saberlo
  res.vary('User-Agent');
  res.vary('Accept');
  res.set('X-Device-Class', type);
  next();
};