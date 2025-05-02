import './style.css';
import { fetchRates } from './api.js';
import { renderRates, setupSearch, setupSort } from './ui.js';
import { loadFavorites } from './favorites.js';

// Load exchange rates on startup
document.addEventListener('DOMContentLoaded', async () => {
  const rates = await fetchRates();

  if (!rates || typeof rates !== 'object') {
    console.error('Could not load valid exchange rates.');
    return;
  }

  renderRates(rates); // Pass the rates object directly
  loadFavorites();
  setupSearch();
  setupSort();
  // setupFilter is now called from within renderRates
});
