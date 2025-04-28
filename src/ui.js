let allRates = {}; // Globale variabele om originele data bij te houden
let isSortedAscending = true; // Toggle voor sorteren

export function renderRates(rates) {
  allRates = rates; // Bewaar volledige lijst
  updateDisplay(Object.entries(allRates));
}

// Update de weergegeven data
function updateDisplay(rateEntries) {
  const table = document.getElementById('ratesTable');
  table.innerHTML = '';

  rateEntries.forEach(([currency, value]) => {
    const div = document.createElement('div');
    div.classList.add('rate-item');
    div.innerHTML = `
      <strong>${currency}</strong>: ${value}
      <button class="add-favorite" data-currency="${currency}">⭐</button>
    `;
    table.appendChild(div);
  });
}

// Zoekfunctie
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

// Sorteerfunctie
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

// Filterfunctie (optioneel, bv. op eerste letter)
export function setupFilter() {
  const filterSelect = document.getElementById('filterRegion');
  
  // Vul de dropdown dynamisch met eerste letters
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
