// public/js/adaptive-chart.js
// Gráfico de comparativa. Solo lo envía el servidor a clientes desktop.
(() => {
  const metricSel = document.querySelector('#metric');
  const canvas = document.querySelector('#chart');
  const METRICS = {
    score: 'Puntaje de rendimiento',
    power: 'Consumo máximo (W)',
    price: 'Precio (USD)',
  };
  let chart = null;
  let visible = [];

  function render() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js no está cargado: revisa public/vendor/chart.umd.js');
      return;
    }
    const key = metricSel.value;
    const labels = visible.map((c) => c.dataset.name);
    const values = visible.map((c) => Number(c.dataset[key]));

    if (!chart) {
      chart = new Chart(canvas, {
        type: 'bar',
        data: { labels, datasets: [{ label: METRICS[key], data: values, backgroundColor: '#1f6feb' }] },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: { legend: { display: false }, title: { display: true, text: METRICS[key] } },
        },
      });
    } else {
      chart.data.labels = labels;
      chart.data.datasets[0].data = values;
      chart.data.datasets[0].label = METRICS[key];
      chart.options.plugins.title.text = METRICS[key];
      chart.update();
    }
  }

  document.addEventListener('catalog:filtered', (e) => { visible = e.detail.visible; render(); });
  metricSel.addEventListener('change', render);
})();