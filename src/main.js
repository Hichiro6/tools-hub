/**
 * Tabox — Main Logic
 * Tool hub management (English interface)
 */

// Design system + main styles (bundled by Vite)
import '../styles/design-system.css'
import '../styles/main.css'

// Tool registration
const tools = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    url: '../image-compressor/',
    icon: '📸'
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    url: '../pdf-merger/',
    icon: '📄'
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    url: '../pdf-splitter/',
    icon: '✂️'
  },
  {
    id: 'pdf-reorder',
    name: 'PDF Reorder',
    url: '../pdf-reorder/',
    icon: '🔄'
  },
  {
    id: 'exif-stripper',
    name: 'EXIF Stripper',
    url: '../exif-stripper/',
    icon: '🗑️'
  },
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    url: '../images-to-pdf/',
    icon: '🖼️'
  },
  {
    id: 'pdf-to-images',
    name: 'PDF to Images',
    url: '../pdf-to-images/',
    icon: '🔤'
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    url: '../qr-code-generator/',
    icon: '🌐'
  }
];

// Initialize service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Tabox SW registered:', registration.scope);
    })
    .catch(error => {
      console.log('Tabox SW registration failed:', error);
    });
}

// Add search/filter functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search tools...';
  searchInput.className = 'tool-search';
  searchInput.style.cssText = `
    width: 100%;
    max-width: 400px;
    padding: 12px 16px;
    margin: 0 auto 2rem;
    background: var(--bg-app);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--foreground);
    font-family: var(--font);
    font-size: 1rem;
    outline: none;
  `;
  
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.insertAdjacentElement('afterend', searchInput);
  }
  
  // Filter logic
  const toolCards = document.querySelectorAll('.tool-card');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    toolCards.forEach(card => {
      const title = card.querySelector('.tool-title').textContent.toLowerCase();
      const desc = card.querySelector('.tool-description').textContent.toLowerCase();
      const matches = title.includes(query) || desc.includes(query);
      card.style.display = matches ? 'flex' : 'none';
    });
  });
});

console.log('Tabox initialized — privacy-first tools hub');
