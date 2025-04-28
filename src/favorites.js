export function loadFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
    favoritesList.innerHTML = '';
    favorites.forEach(currency => {
      const div = document.createElement('div');
      div.textContent = currency;
      favoritesList.appendChild(div);
    });
  }
  
    