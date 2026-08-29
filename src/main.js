/**
 * Tabox — Main Logic
 * Tool hub management (English interface)
 */

// Design system + main styles (bundled by Vite)
import '../styles/design-system.css'
import '../styles/main.css'

// Initialize service worker (relative path for portability)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(registration => {
      console.log('Tabox SW registered:', registration.scope);
    })
    .catch(error => {
      console.log('Tabox SW registration failed:', error);
    });
}

// Search + filter functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const toolCards = document.querySelectorAll('.app-card');
  const noResults = document.querySelector('.no-results');
  const srLive = document.getElementById('sr-live');

  let currentFilter = 'all';

  // Announce to screen readers
  function announce(message) {
    if (srLive) {
      srLive.textContent = message;
    }
  }

  // Filter logic
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    let visibleCount = 0;

    toolCards.forEach(card => {
      const title = card.querySelector('.app-card__title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.app-card__desc')?.textContent.toLowerCase() || '';
      const category = card.dataset.category || '';

      const matchesSearch = title.includes(query) || desc.includes(query);
      const matchesFilter = currentFilter === 'all' || category === currentFilter;

      if (matchesSearch && matchesFilter) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    announce(`${visibleCount} ${visibleCount === 1 ? 'tool' : 'tools'} found`);
  }

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Filter button listeners
  filterBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      applyFilters();
    });

    // Keyboard navigation: arrow keys to move between filter buttons (WCAG 2.1)
    btn.addEventListener('keydown', (e) => {
      let targetIndex = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (index + 1) % filterBtns.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (index - 1 + filterBtns.length) % filterBtns.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = filterBtns.length - 1;
      }

      if (targetIndex !== null) {
        filterBtns[targetIndex].focus();
        filterBtns[targetIndex].click();
      }
    });
  });
});

console.log('Tabox initialized — privacy-first tools hub');
