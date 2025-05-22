export function loadFavorites() {
  const favorites = getFavorites(); // Haal de favorieten op uit localStorage
  const favoritesList = document.getElementById('favoritesList');
  favoritesList.innerHTML = '';

  favorites.forEach(currency => {
    const div = document.createElement('div');
    div.classList.add('favorite-item');
    div.innerHTML = `
      <span>${currency}</span>
      <button class="remove-fav" data-currency="${currency}">🗑️</button>
    `;
    favoritesList.appendChild(div);
  });

  // Koppel eventlisteners aan verwijderknoppen
  document.querySelectorAll('.remove-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFavorite(btn.dataset.currency);
      loadFavorites();
    });
  });
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}// Haal de favorieten op uit localStorage

export function addFavorite(currency) {
  const favorites = getFavorites();
  if (!favorites.includes(currency)) {
    favorites.push(currency);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}// Voeg een valuta toe aan de favorieten

export function removeFavorite(currency) {
  let favorites = getFavorites();
  favorites = favorites.filter(item => item !== currency);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}// Verwijder een valuta uit de favorieten
