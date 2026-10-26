const fs = require('fs');
const path = require('path');

const measurementsPath = path.join(__dirname, '../evidence/measurements.json');
const resultsPath = path.join(__dirname, '../evidence/results.md');

// Calcula la mediana de un arreglo numérico
function getMedian(values) {
    if (!values || values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

try {
    const data = JSON.parse(fs.readFileSync(measurementsPath, 'utf8'));
    
    // Las claves (key) deben coincidir exactamente con las que usaste en tu measurements.json
    const metrics = [
        { key: 'html', name: 'Tamaño del documento inicial (HTML) (kB)' },
        { key: 'total', name: 'Peso total de la página (kB)' },
        { key: 'requests', name: 'Número de peticiones HTTP' },
        { key: 'lcp', name: 'Largest Contentful Paint (LCP) (s)' },
        { key: 'cls', name: 'Cumulative Layout Shift (CLS)' }
    ];

    let md = `| Métrica / Indicador | RWD (Móvil) | AWD (Móvil) | Delta (%) |\n|---|---|---|---|\n`;

    metrics.forEach(m => {
        const rwdMed = getMedian(data.rwd[m.key]);
        const awdMed = getMedian(data.awd[m.key]);
        
        // Fórmula del delta: (AWD - RWD) / RWD * 100
        let delta = "N/A";
        if (rwdMed > 0) {
            delta = (((awdMed - rwdMed) / rwdMed) * 100).toFixed(2);
        } else if (rwdMed === 0 && awdMed === 0) {
            delta = "0.00";
        }

        const rwdVal = Number.isInteger(rwdMed) ? rwdMed : rwdMed.toFixed(2);
        const awdVal = Number.isInteger(awdMed) ? awdMed : awdMed.toFixed(2);

        md += `| ${m.name} | ${rwdVal} | ${awdVal} | ${delta} |\n`;
    });

    fs.writeFileSync(resultsPath, md, 'utf8');
    console.log('✅ Cálculos completados. Revisa evidence/results.md');

} catch (err) {
    console.error('❌ Error al procesar:', err.message);
    console.log('Verifica que measurements.json exista y tenga el formato correcto.');
}