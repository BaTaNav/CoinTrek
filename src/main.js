import './style.css';
import { fetchRates } from './api.js';
import { renderRates, setupSearch, setupSort } from './ui.js';
import { loadFavorites } from './favorites.js';

// wisselkoersen laden bij startup
document.addEventListener('DOMContentLoaded', async () => {
  const rates = await fetchRates();

  if (!rates || typeof rates !== 'object') {
    console.error('Could not load exchange rates.');
    return;
  }

  renderRates(rates);
  loadFavorites();
  setupSearch();
  setupSort();
  
  // Setup auto-refresh for real-time updates
  setupAutoRefresh();
});

// Setup auto-refresh for exchange rates
function setupAutoRefresh() {
  const refreshInterval = 60000; // Refresh every 60 seconds
  let refreshTimer;
  let refreshCountdown = refreshInterval / 1000;
  
  // Create refresh indicator
  const refreshIndicator = document.createElement('div');
  refreshIndicator.className = 'refresh-indicator';
  refreshIndicator.innerHTML = `<span>Refreshing in ${refreshCountdown}s</span>
    <button class="refresh-now">Refresh Now</button>`;
  document.querySelector('.section-header').appendChild(refreshIndicator);
  
  // Setup refresh countdown
  const countdownElement = refreshIndicator.querySelector('span');
  const countdownInterval = setInterval(() => {
    refreshCountdown -= 1;
    countdownElement.textContent = `Refreshing in ${refreshCountdown}s`;
    
    if (refreshCountdown <= 0) {
      refreshCountdown = refreshInterval / 1000;
    }
  }, 1000);
  
  // Setup auto-refresh timer
  refreshTimer = setInterval(async () => {
    const rates = await fetchRates();
    if (rates && typeof rates === 'object') {
      renderRates(rates);
      // Show a toast notification
      showToast('Exchange rates updated');
    }
    refreshCountdown = refreshInterval / 1000;
  }, refreshInterval);
  
  // Setup manual refresh button
  const refreshButton = refreshIndicator.querySelector('.refresh-now');
  refreshButton.addEventListener('click', async () => {
    clearInterval(refreshTimer);
    refreshCountdown = refreshInterval / 1000;
    
    // Show loading state
    refreshButton.textContent = 'Loading...';
    refreshButton.disabled = true;
    
    const rates = await fetchRates();
    if (rates && typeof rates === 'object') {
      renderRates(rates);
      showToast('Exchange rates updated');
    }
    
    // Reset button
    refreshButton.textContent = 'Refresh Now';
    refreshButton.disabled = false;
    
    // Restart timer
    refreshTimer = setInterval(async () => {
      const rates = await fetchRates();
      if (rates && typeof rates === 'object') {
        renderRates(rates);
        showToast('Exchange rates updated');
      }
      refreshCountdown = refreshInterval / 1000;
    }, refreshInterval);
  });
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-switch');
  
  // Check for saved theme preference or prefer-color-scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme based on saved preference or system preference
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-theme');
    themeSwitch.checked = true;
  }
  
  // Toggle theme when switch is clicked
  themeSwitch.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('show');
    });
  }
  
  // Update theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  const lightIcon = themeToggle?.querySelector('.light-icon');
  const darkIcon = themeToggle?.querySelector('.dark-icon');
  
  function updateThemeToggle() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    if (lightIcon && darkIcon) {
      lightIcon.style.display = isDarkTheme ? 'none' : 'inline';
      darkIcon.style.display = isDarkTheme ? 'inline' : 'none';
    }
  }
  
  // Initial state
  updateThemeToggle();
  
  // Update on theme change
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      updateThemeToggle();
      
      // Save preference to localStorage
      const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });
  }
});
