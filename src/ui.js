let allRates = {}; // Globale variabele om alle wisselkoersen op te slaan
let isSortedAscending = true; // toggle om te sorteren
let currentFilterValue = ''; // Track current filter
let currentSearchValue = ''; // Track current search
import { addFavorite, removeFavorite, loadFavorites, getFavorites } from './favorites.js';

export function renderRates(rates) {
  // zorg ervoor dat alle wissekoerssen goed zijn geformatteerd als een object
  allRates = typeof rates === 'object' && !Array.isArray(rates)
    ? rates
    : Object.fromEntries(rates);

  // Apply any existing filters/sorts
  let rateEntries = Object.entries(allRates);

  // Apply any saved filters or sorting
  rateEntries = applyFiltersAndSort(rateEntries);

  updateDisplay(rateEntries);
  setupFilter();
}

// Centralized function to apply current filters and sorting
function applyFiltersAndSort(rateEntries) {
  // Apply search filter if exists
  if (currentSearchValue) {
    rateEntries = rateEntries.filter(([currency]) =>
      currency.toLowerCase().includes(currentSearchValue.toLowerCase()));
  }

  // Apply category filter if exists
  if (currentFilterValue && currentFilterValue !== 'all') {
    // Handle favorites filter
    if (currentFilterValue === 'favorites') {
      const favorites = getFavorites();
      rateEntries = rateEntries.filter(([currency]) => favorites.includes(currency));
    }
    // Handle letter filter
    else if (currentFilterValue.startsWith('letter:')) {
      const letter = currentFilterValue.replace('letter:', '');
      rateEntries = rateEntries.filter(([currency]) =>
        currency.charAt(0).toUpperCase() === letter);
    }
    // Handle region filter
    else if (currentFilterValue.startsWith('region:')) {
      const region = currentFilterValue.replace('region:', '');
      rateEntries = rateEntries.filter(([_, data]) =>
        data.region === region);
    }
  }

  // Apply current sort
  rateEntries.sort((a, b) => {
    const valueA = a[1].value;
    const valueB = b[1].value;
    return isSortedAscending ? valueA - valueB : valueB - valueA;
  });

  return rateEntries;
}

// Update de weergegeven data
function updateDisplay(rateEntries) {
  const table = document.getElementById('ratesTable');
  table.innerHTML = '';

  // Add table header with improved styling
  const header = document.createElement('div');
  header.className = 'table-header';
  header.style.display = 'grid';
  header.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr 70px';
  header.innerHTML = `
    <div class="header-cell">Code</div>
    <div class="header-cell">Name</div>
    <div class="header-cell">Region</div>
    <div class="header-cell">Rate</div>
    <div class="header-cell">Updated</div>
    <div class="header-cell"">Favs</div>
  `;
  table.appendChild(header);

  // Display the rates
  rateEntries.forEach(([currency, value]) => {
    const div = document.createElement('div');
    div.classList.add('rate-item');
    const isFavorite = getFavorites().includes(currency);
    div.innerHTML = `
      <div><strong>${currency}</strong></div>
      <div>${value.description}</div>
      <div>${value.region}</div>
      <div class="value">${value.value.toFixed(4)}</div>
      <div>${new Date().toLocaleString()}</div>
      <button class="add-favorite ${isFavorite ? 'active' : ''}" data-currency="${currency}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          ${isFavorite ?
            '<path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>' :
            '<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>'}
        </svg>
      </button>
    `;
    table.appendChild(div);
  });

  // Add event listeners to favorite buttons
  document.querySelectorAll('.add-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event bubbling
      const currency = btn.dataset.currency;
      const favorites = getFavorites();

      if (favorites.includes(currency)) {
        removeFavorite(currency);
      } else {
        addFavorite(currency);
      }

      // Update favorites list
      loadFavorites();

      // Just update this button's state without redrawing the whole table
      btn.classList.toggle('active');
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          ${btn.classList.contains('active') ?
          '<path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>' :
          '<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>'}
        </svg>
      `;
    });
  });
}

// zoek functie
export function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    currentSearchValue = e.target.value;
    const filteredEntries = applyFiltersAndSort(Object.entries(allRates));
    updateDisplay(filteredEntries);
  });
}

// sorteer functie
export function setupSort() {
  const sortButton = document.getElementById('sortButton');
  if (sortButton) {
    sortButton.addEventListener('click', () => {
      isSortedAscending = !isSortedAscending;
      sortButton.innerHTML = `Sort ${isSortedAscending ? '↑' : '↓'}`;

      const sortedEntries = applyFiltersAndSort(Object.entries(allRates));
      updateDisplay(sortedEntries);
    });
  }
}

function setupFilter() {
  const filterSelect = document.getElementById('filterSelect');
  if (!filterSelect) return;

  // Clear existing options
  filterSelect.innerHTML = '';

  // Add base options
  const baseOptions = document.createElement('optgroup');
  baseOptions.label = "General Filters";

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Currencies';
  baseOptions.appendChild(allOption);

  const favOption = document.createElement('option');
  favOption.value = 'favorites';
  favOption.textContent = 'Favorites';
  baseOptions.appendChild(favOption);

  filterSelect.appendChild(baseOptions);

  // Create region filter group
  const regionGroup = document.createElement('optgroup');
  regionGroup.label = "Filter by Region";

  // Collect unique regions
  const regions = new Set();
  Object.values(allRates).forEach(data => {
    if (data.region && data.region !== 'Unknown') {
      regions.add(data.region);
    }
  });

  // Sort regions alphabetically
  const sortedRegions = Array.from(regions).sort();

  // Add region options
  sortedRegions.forEach(region => {
    const option = document.createElement('option');
    option.value = `region:${region}`;
    option.textContent = region;
    regionGroup.appendChild(option);
  });

  // Add region group if there are regions
  if (sortedRegions.length > 0) {
    filterSelect.appendChild(regionGroup);
  }

  // Restore selected value if it exists
  if (currentFilterValue) {
    try {
      filterSelect.value = currentFilterValue;
    } catch (e) {
      filterSelect.value = 'all';
    }
  }

  // Add event listener
  filterSelect.addEventListener('change', (e) => {
    currentFilterValue = e.target.value;
    const filteredEntries = applyFiltersAndSort(Object.entries(allRates));
    updateDisplay(filteredEntries);
  });
}