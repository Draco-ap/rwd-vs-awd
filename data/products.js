// data/products.js
// Fuente única de datos. RWD y AWD consumen exactamente los mismos 12 productos.
// NOTA: productos y especificaciones ficticios, creados solo para la práctica.

const raw = [
  // --- Servidores 1U ---
  { slug: 'atlas-e1', name: 'Atlas E1', category: 'Servidor 1U', cores: 16, ramGB: 64,   storageTB: 2,   storageType: 'NVMe', powerW: 300,  rackUnits: 1, network: '2x 10GbE',  price: 1890,  score: 5200 },
  { slug: 'atlas-e2', name: 'Atlas E2', category: 'Servidor 1U', cores: 24, ramGB: 128,  storageTB: 4,   storageType: 'NVMe', powerW: 400,  rackUnits: 1, network: '2x 10GbE',  price: 2790,  score: 7600 },
  { slug: 'atlas-e3', name: 'Atlas E3', category: 'Servidor 1U', cores: 32, ramGB: 256,  storageTB: 8,   storageType: 'NVMe', powerW: 550,  rackUnits: 1, network: '2x 25GbE',  price: 4350,  score: 10400 },
  // --- Servidores 2U ---
  { slug: 'borealis-m1', name: 'Borealis M1', category: 'Servidor 2U', cores: 32, ramGB: 256,  storageTB: 16,  storageType: 'SSD',  powerW: 650,  rackUnits: 2, network: '2x 25GbE',  price: 5200,  score: 11200 },
  { slug: 'borealis-m2', name: 'Borealis M2', category: 'Servidor 2U', cores: 64, ramGB: 512,  storageTB: 24,  storageType: 'SSD',  powerW: 900,  rackUnits: 2, network: '2x 25GbE',  price: 8900,  score: 20500 },
  { slug: 'borealis-m3', name: 'Borealis M3', category: 'Servidor 2U', cores: 96, ramGB: 1024, storageTB: 32,  storageType: 'SSD',  powerW: 1200, rackUnits: 2, network: '4x 25GbE',  price: 14600, score: 31800 },
  // --- Servidores GPU ---
  { slug: 'cygnus-g1', name: 'Cygnus G1', category: 'Servidor GPU', cores: 32, ramGB: 256,  storageTB: 8,   storageType: 'NVMe', powerW: 1600, rackUnits: 2, network: '2x 25GbE',  price: 21500, score: 48000 },
  { slug: 'cygnus-g2', name: 'Cygnus G2', category: 'Servidor GPU', cores: 64, ramGB: 512,  storageTB: 16,  storageType: 'NVMe', powerW: 2400, rackUnits: 4, network: '2x 100GbE', price: 38900, score: 82000 },
  { slug: 'cygnus-g3', name: 'Cygnus G3', category: 'Servidor GPU', cores: 96, ramGB: 1024, storageTB: 30,  storageType: 'NVMe', powerW: 3200, rackUnits: 4, network: '4x 100GbE', price: 74000, score: 150000 },
  // --- Almacenamiento ---
  { slug: 'dorado-s1', name: 'Dorado S1', category: 'Almacenamiento', cores: 8,  ramGB: 32,  storageTB: 48,  storageType: 'HDD', powerW: 450,  rackUnits: 2, network: '2x 10GbE', price: 3900,  score: 2800 },
  { slug: 'dorado-s2', name: 'Dorado S2', category: 'Almacenamiento', cores: 16, ramGB: 128, storageTB: 120, storageType: 'HDD', powerW: 700,  rackUnits: 4, network: '2x 25GbE', price: 7400,  score: 4900 },
  { slug: 'dorado-s3', name: 'Dorado S3', category: 'Almacenamiento', cores: 24, ramGB: 256, storageTB: 360, storageType: 'HDD', powerW: 1000, rackUnits: 4, network: '2x 25GbE', price: 13900, score: 7300 },
];

const products = raw.map((p, i) => ({
  id: i + 1,
  ...p,
  // Resumen corto: se muestra en la tarjeta (móvil y desktop)
  highlights: [
    `${p.cores} núcleos`,
    `${p.ramGB} GB RAM`,
    `${p.storageTB} TB ${p.storageType}`,
  ],
  // Especificaciones completas: SOLO se enviarán en la vista desktop del AWD
  specs: {
    'Procesador': `${p.cores} núcleos`,
    'Memoria': `${p.ramGB} GB DDR5 ECC`,
    'Almacenamiento': `${p.storageTB} TB ${p.storageType}`,
    'Red': p.network,
    'Consumo máximo': `${p.powerW} W`,
    'Formato': `${p.rackUnits}U para rack`,
    'Gestión remota': 'BMC con interfaz web',
    'Garantía': '3 años on-site',
    'Puntaje de rendimiento': String(p.score),
  },
}));

module.exports = products;