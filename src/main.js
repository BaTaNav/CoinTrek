import { fetchRates } from './api.js';
import { renderRates, setupSearch, setupSort, setupFilter } from './ui.js';
import { loadFavorites } from './favorites.js';

// Laad wisselkoersen bij het starten
document.addEventListener('DOMContentLoaded', async () => {
  const rates = await fetchRates();
  renderRates(rates);
  loadFavorites();
  setupSearch();
  setupSort();
  setupFilter();
});
