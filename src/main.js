/**
 * Tools Hub — Main Logic
 * Tool hub management with EN/FR translations
 */

// Design system + main styles (bundled by Vite)
import '../styles/design-system.css';
import '../styles/main.css';

// Initialize service worker (relative path for portability)
if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('./sw.js')
		.then((registration) => {
			console.log('Tools Hub SW registered:', registration.scope);
		})
		.catch((error) => {
			console.log('Tools Hub SW registration failed:', error);
		});
}

// ── i18n ──────────────────────────────────────
const translations = {
	en: {
		tagline: 'Privacy-first browser tools. All local.',
		searchPlaceholder: 'Search tools...',
		filterAll: 'All',
		filterImage: 'Image',
		filterPdf: 'PDF',
		noResults: 'No tools found. Try a different search.',
		toolsFound: (n) => `${n} ${n === 1 ? 'tool' : 'tools'} found`,
		cardDesc: {
			'image-compressor': 'Compress images client-side',
			'pdf-merger': 'Merge PDFs locally in browser',
			'pdf-splitter': 'Split PDF pages client-side',
			'pdf-reorder': 'Reorganize PDF pages',
			'exif-stripper': 'Remove metadata from images',
			'images-to-pdf': 'Convert images to PDF',
			'pdf-to-images': 'Extract pages as images',
			'qr-code-generator': 'Create QR codes locally',
		},
		cardBadge: { image: 'Image', pdf: 'PDF' },
	},
	fr: {
		tagline: 'Outils navigateur privacy-first. 100% local.',
		searchPlaceholder: 'Rechercher un outil...',
		filterAll: 'Tous',
		filterImage: 'Image',
		filterPdf: 'PDF',
		noResults: 'Aucun outil trouvé. Essayez une autre recherche.',
		toolsFound: (n) => `${n} ${n <= 1 ? 'outil' : 'outils'} trouvé${n > 1 ? 's' : ''}`,
		cardDesc: {
			'image-compressor': 'Compresser des images localement',
			'pdf-merger': 'Fusionner des PDFs dans le navigateur',
			'pdf-splitter': 'Diviser des PDFs localement',
			'pdf-reorder': "Réorganiser les pages d'un PDF",
			'exif-stripper': "Supprimer les métadonnées d'images",
			'images-to-pdf': 'Convertir des images en PDF',
			'pdf-to-images': 'Extraire les pages en images',
			'qr-code-generator': 'Créer des QR codes localement',
		},
		cardBadge: { image: 'Image', pdf: 'PDF' },
	},
};

let currentLang = localStorage.getItem('lang') || 'en';

function applyLang(lang) {
	const t = translations[lang] || translations.en;
	currentLang = lang;
	localStorage.setItem('lang', lang);

	// Tagline
	const tagline = document.querySelector('.header__tagline');
	if (tagline) tagline.textContent = t.tagline;

	// Search placeholder
	const searchInput = document.querySelector('.search-input');
	if (searchInput) searchInput.placeholder = t.searchPlaceholder;

	// Filter buttons
	const filterBtns = document.querySelectorAll('.filter-btn');
	const filterKeys = ['all', 'image', 'pdf'];
	filterBtns.forEach((btn, i) => {
		const key = filterKeys[i];
		if (key)
			btn.textContent = key === 'all' ? t.filterAll : key === 'image' ? t.filterImage : t.filterPdf;
	});

	// Card descriptions + badges
	document.querySelectorAll('.app-card').forEach((card) => {
		const href = card.getAttribute('href') || '';
		const slug = href.replace(/\/$/, '').split('/').pop();
		const descEl = card.querySelector('.app-card__desc');
		const badgeEl = card.querySelector('.app-card__badge');
		if (descEl && t.cardDesc[slug]) descEl.textContent = t.cardDesc[slug];
		if (badgeEl) {
			const cat = card.dataset.category;
			if (cat && t.cardBadge[cat]) badgeEl.textContent = t.cardBadge[cat];
		}
	});

	// No results message
	const noResults = document.querySelector('.no-results');
	if (noResults) noResults.textContent = t.noResults;

	// Active button sync
	document.querySelectorAll('.lang-btn').forEach((btn) => {
		btn.classList.toggle('active', btn.dataset.lang === lang);
	});

	// <html lang="...">
	document.documentElement.lang = lang;
}

// Search + filter functionality
document.addEventListener('DOMContentLoaded', () => {
	// Apply saved language
	applyLang(currentLang);

	// Language selector buttons
	document.querySelectorAll('.lang-btn').forEach((btn) => {
		btn.addEventListener('click', () => {
			applyLang(btn.dataset.lang);
			applyFilters(); // re-announce in new language
		});
	});

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
		const t = translations[currentLang] || translations.en;
		const query = searchInput ? searchInput.value.toLowerCase() : '';
		let visibleCount = 0;

		toolCards.forEach((card) => {
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

		announce(t.toolsFound(visibleCount));
	}

	// Search input listener
	if (searchInput) {
		searchInput.addEventListener('input', applyFilters);
	}

	// Filter button listeners
	filterBtns.forEach((btn, index) => {
		btn.addEventListener('click', () => {
			filterBtns.forEach((b) => {
				b.classList.remove('active');
				b.setAttribute('aria-checked', 'false');
			});
			btn.classList.add('active');
			btn.setAttribute('aria-checked', 'true');
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

console.log('Tools Hub initialized — privacy-first tools collection');
