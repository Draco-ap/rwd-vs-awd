# Catálogo de servidores: RWD vs. AWD

Práctica de laboratorio que compara dos estrategias de entrega de interfaces web con el mismo catálogo (12 productos ficticios, filtros y gráfico de comparativa):

- **RWD** (`/responsive`): un único HTML estático para todos los clientes; la interfaz se adapta en el navegador con CSS Grid, Flexbox, media queries y `<picture>`/`srcset`.
- **AWD** (`/adaptive`): un servidor Express detecta el dispositivo (User-Agent y `Accept`) y renderiza una plantilla distinta. La vista móvil **no incluye** el gráfico, Chart.js ni la tabla de especificaciones.

> Los productos y especificaciones son ficticios.

## Requisitos
- Node.js 18 o superior
- Google Chrome (DevTools y Lighthouse) para reproducir las mediciones

## Instalación y arranque local
```bash
git clone [https://github.com/Draco-ap/rwd-vs-awd.git](https://github.com/Draco-ap/rwd-vs-awd.git)
cd rwd-vs-awd
npm install
npm start