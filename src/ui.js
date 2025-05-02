let allRates = {};
let isSortedAscending = true;
import { addFavorite, removeFavorite, loadFavorites, getFavorites } from './favorites.js';

let previousRates = {};

export function renderRates(rates) {
  const ratesTable = document.getElementById('ratesTable');
  ratesTable.innerHTML = '';
  allRates = rates;

  Object.entries(rates).forEach(([code, data]) => {
    if (code === 'EUR') return;

    const card = document.createElement('div');
    card.className = 'currency-card';
    card.dataset.code = code;

    let changeClass = '';
    let changeIcon = '';
    if (previousRates[code] && previousRates[code].value !== data.value) {
      if (data.value > previousRates[code].value) {
        changeClass = 'rate-increased';
        changeIcon = '<span class="change-icon">↑</span>';
      } else {
        changeClass = 'rate-decreased';
        changeIcon = '<span class="change-icon">↓</span>';
      }
    }

    card.innerHTML = `
      <div class="currency-flag">${getFlagEmoji(code)}</div>
      <div class="currency-info">
        <h3>${code}</h3>
        <p>${data.description}</p>
      </div>
      <div class="currency-value ${changeClass}">
        ${changeIcon}
        <span>${data.value.toFixed(4)}</span>
      </div>
      <button class="favorite-btn" data-code="${code}">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
        </svg>
      </button>
    `;

    ratesTable.appendChild(card);
  });

  previousRates = { ...rates };
  setupFavoriteButtons();
  setupFilter();
}

function getFlagEmoji(code) {
  if (code.length < 2) return '';
  const countryCode = code.slice(0, 2);
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function updateDisplay(rateEntries) {
  const table = document.getElementById('ratesTable');
  table.innerHTML = '';

  rateEntries.forEach(([currency, data]) => {
    const div = document.createElement('div');
    div.classList.add('rate-item');
    div.innerHTML = `
      <div>
        <strong>${currency}</strong>
        <div class="value">${data.value.toFixed(4)}</div>
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

export function setupSort() {
  const sortButton = document.getElementById('sortButton');
  sortButton.addEventListener('click', () => {
    const sorted = Object.entries(allRates).sort((a, b) => {
      return isSortedAscending
        ? a[1].value - b[1].value
        : b[1].value - a[1].value;
    });
    isSortedAscending = !isSortedAscending;
    updateDisplay(sorted);
  });
}

function setupFilter() {
  const filterSelect = document.getElementById('filterRegion');
  filterSelect.innerHTML = '<option value="">All</option>';

  const letters = [...new Set(Object.keys(allRates).map(code => code[0]))].sort();
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

function setupFavoriteButtons() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      const favorites = getFavorites();
      if (favorites.includes(code)) {
        removeFavorite(code);
      } else {
        addFavorite(code);
      }
      loadFavorites();
    });
  });
}