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
  setupSearch();
  setupSort();
  setupAutoRefresh();
  setupFavoritesObserver();
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
    
    // Refresh button
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

// Add active class to nav items based on scroll position
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  
  function highlightNavItem() {
    let scrollPosition = window.scrollY;
    
    // Add some offset for better UX
    scrollPosition += 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all nav items
        navItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to corresponding nav item
        const correspondingNavItem = document.querySelector(`.nav-item[href="#${sectionId}"]`);
        if (correspondingNavItem) {
          correspondingNavItem.classList.add('active');
        }
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavItem);




  function setupFavoritesObserver() {
  const favoritesSection = document.getElementById('favorites');
  if (!favoritesSection) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadFavorites(); // jouw bestaande functie
        observer.unobserve(entry.target); // maar één keer uitvoeren
      }
    });
  }, {
    root: null,
    threshold: 0.25, // pas als 25% zichtbaar is
  });

  observer.observe(favoritesSection);
}
  
  // Also add click event listeners for smooth scrolling
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Smooth scroll to section
        window.scrollTo({
          top: targetSection.offsetTop - 80, // Offset for header
          behavior: 'smooth'
        });
        
        // Update active class
        navItems.forEach(navItem => navItem.classList.remove('active'));
        this.classList.add('active');
        
        // Close mobile menu if open
        const mainNav = document.querySelector('.main-nav');
        if (mainNav && mainNav.classList.contains('show')) {
          mainNav.classList.remove('show');
        }
      }
    });
  });
});
