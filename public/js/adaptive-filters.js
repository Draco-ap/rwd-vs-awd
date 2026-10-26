// public/js/adaptive-filters.js
// Lógica común del AWD: filtros del lado del cliente y panel inferior (solo existe en mobile).
(() => {
  const $ = (sel) => document.querySelector(sel);
  const cards = [...document.querySelectorAll('.card')];
  const form = $('#filters-form');
  const sidebar = $('#filters');
  const openBtn = $('#toggle-filters');   // null en desktop
  const closeBtn = $('#close-filters');   // null en desktop
  const countEl = $('#result-count');
  const emptyEl = $('#empty');
  const priceOut = $('#price-out');
  const cartEl = $('#cart-count');

  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

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
    document.dispatchEvent(new CustomEvent('catalog:filtered', { detail: { visible } }));
  }

  // Panel inferior (solo mobile)
  if (openBtn && closeBtn) {
    const setPanel = (open) => {
      sidebar.classList.toggle('is-open', open);
      openBtn.setAttribute('aria-expanded', String(open));
    };
    openBtn.addEventListener('click', () => setPanel(!sidebar.classList.contains('is-open')));
    closeBtn.addEventListener('click', () => setPanel(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setPanel(false); });
  }

  form.addEventListener('input', applyFilters);
  form.addEventListener('reset', () => setTimeout(applyFilters, 0));
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-buy]')) cartEl.textContent = String(Number(cartEl.textContent) + 1);
  });

  applyFilters();
})();