let allRates = {}; // Globale variabele om alle wisselkoersen op te slaan
let isSortedAscending = true; // toggle om te sorteren
import { addFavorite, removeFavorite, loadFavorites, getFavorites } from './favorites.js';

export function renderRates(rates) {
  // zorg ervoor dat alle wissekoerssen goed zijn geformatteerd als een object
  allRates = typeof rates === 'object' && !Array.isArray(rates) 
    ? rates 
    : Object.fromEntries(rates);
    
  updateDisplay(Object.entries(allRates));
  

  setupFilter();
}

// Update de weergegeven data
function updateDisplay(rateEntries) {
  const table = document.getElementById('ratesTable');
  table.innerHTML = '';

  rateEntries.forEach(([currency, value]) => {
    const div = document.createElement('div');
    div.classList.add('rate-item');
    div.innerHTML = `
      <div>
        <strong>${currency}</strong>
        <div class="value">${value}</div>
      </div>
      <button class="add-favorite ${getFavorites().includes(currency) ? 'active' : ''}" data-currency="${currency}">
        ${getFavorites().includes(currency) ? '✅' : '⭐'}
      </button>
    `;
    table.appendChild(div);
  });

 
  document.querySelectorAll('.add-favorite').forEach(btn => {
    btn.addEventListener('click', () => {
      const currency = btn.dataset.currency;
      const favorites = getFavorites();
      if (favorites.includes(currency)) {
        removeFavorite(currency);
      } else {
        addFavorite(currency);
      }
      loadFavorites();
      updateDisplay(Object.entries(allRates)); 
    });
  });
}

// zoek functie
export function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toUpperCase();
    const filtered = Object.entries(allRates).filter(([currency]) =>
      currency.includes(searchTerm)
    );
    updateDisplay(filtered);
  });
}

// sorteer functie
export function setupSort() {
  const sortButton = document.getElementById('sortButton');
  sortButton.addEventListener('click', () => {
    const sorted = Object.entries(allRates).sort((a, b) => {
      return isSortedAscending
        ? a[1] - b[1]
        : b[1] - a[1];
    });
    isSortedAscending = !isSortedAscending;
    updateDisplay(sorted);
  });
}


function setupFilter() {
  const filterSelect = document.getElementById('filterRegion');
  
  // Clear existing options first
  filterSelect.innerHTML = '<option value="">All</option>';

  // Get unique first letters from currency codes
  const letters = [...new Set(Object.keys(allRates).map(code => code[0]))].sort();
  
  // Populate dropdown with first letters
  letters.forEach(letter => {
    const option = document.createElement('option');
    option.value = letter;
    option.textContent = letter;
    filterSelect.appendChild(option);
  });

  filterSelect.addEventListener('change', (e) => {
    const selectedLetter = e.target.value;
    if (selectedLetter === '') {
      updateDisplay(Object.entries(allRates));
    } else {
      const filtered = Object.entries(allRates).filter(([currency]) =>
        currency.startsWith(selectedLetter)
      );
      updateDisplay(filtered);
    }
  });
}