// public/js/responsive.js
// Filtros del lado del cliente, panel inferior colapsable y gráfico de comparativa.
(() => {
  const $ = (sel) => document.querySelector(sel);
  const cards = [...document.querySelectorAll('.card')];
  const form = $('#filters-form');
  const sidebar = $('#filters');
  const openBtn = $('#toggle-filters');
  const closeBtn = $('#close-filters');
  const metricSel = $('#metric');
  const countEl = $('#result-count');
  const emptyEl = $('#empty');
  const priceOut = $('#price-out');
  const cartEl = $('#cart-count');

  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const METRICS = {
    score: 'Puntaje de rendimiento',
    power: 'Consumo máximo (W)',
    price: 'Precio (USD)',
  };

  // ---------- Filtros ----------
  function readFilters() {
    const fd = new FormData(form);
    return {
      cats: fd.getAll('cat'),
      storage: fd.get('storage'),
      minRam: Number(fd.get('ram')),
      maxPrice: Number(fd.get('price')),
    };
  }

  function matches(card, f) {
    const d = card.dataset;
    return f.cats.includes(d.category)
      && (f.storage === 'all' || d.storage === f.storage)
      && Number(d.ram) >= f.minRam
      && Number(d.price) <= f.maxPrice;
  }

  function applyFilters() {
    const f = readFilters();
    const visible = cards.filter((c) => {
      const ok = matches(c, f);
      c.hidden = !ok;
      return ok;
    });
    countEl.textContent = `${visible.length} de ${cards.length} productos`;
    emptyEl.hidden = visible.length > 0;
    priceOut.textContent = usd.format(f.maxPrice);
    updateChart(visible);
  }

  // ---------- Gráfico de comparativa ----------
  let chart = null;
  function updateChart(visible) {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js no está cargado: revisa public/vendor/chart.umd.js');
      return;
    }
    const key = metricSel.value;
    const labels = visible.map((c) => c.dataset.name);
    const values = visible.map((c) => Number(c.dataset[key]));

    if (!chart) {
      chart = new Chart($('#chart'), {
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

  // ---------- Panel inferior (móvil/tablet) ----------
  function setPanel(open) {
    sidebar.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
  }
  openBtn.addEventListener('click', () => setPanel(!sidebar.classList.contains('is-open')));
  closeBtn.addEventListener('click', () => setPanel(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setPanel(false); });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) setPanel(false); });

  // ---------- Eventos ----------
  form.addEventListener('input', applyFilters);
  form.addEventListener('reset', () => setTimeout(applyFilters, 0));
  metricSel.addEventListener('change', applyFilters);
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-buy]')) cartEl.textContent = String(Number(cartEl.textContent) + 1);
  });

  applyFilters();
})();