import { fetchRates } from './api.js';
import { renderRates } from './ui.js';
import { loadFavorites } from './favorites.js';

// Laad wisselkoersen bij het starten
document.addEventListener('DOMContentLoaded', async () => {
  const rates = await fetchRates();
  renderRates(rates);
  loadFavorites();
});
