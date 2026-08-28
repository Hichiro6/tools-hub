import './style.css'

// Search & filter functionality
const searchInput = document.getElementById('searchInput')
const appsGrid = document.getElementById('appsGrid')
const filterBtns = document.querySelectorAll('.filter-btn')
const visibleCount = document.getElementById('visibleCount')

let activeCategory = 'all'

// Search filter
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase()
  filterApps(query, activeCategory)
})

// Category filters
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    activeCategory = btn.dataset.category
    filterApps(searchInput.value.toLowerCase(), activeCategory)
  })
})

function filterApps(query, category) {
  const cards = document.querySelectorAll('.app-card')
  let visible = 0

  cards.forEach(card => {
    const title = card.querySelector('.app-card__title').textContent.toLowerCase()
    const desc = card.querySelector('.app-card__desc').textContent.toLowerCase()
    const cardCategories = card.dataset.category || ''

    const matchesQuery = !query || title.includes(query) || desc.includes(query)
    const matchesCategory = category === 'all' || cardCategories.includes(category)

    if (matchesQuery && matchesCategory) {
      card.classList.remove('hidden')
      visible++
    } else {
      card.classList.add('hidden')
    }
  })

  visibleCount.textContent = visible

  // Show/hide empty state
  let noResults = document.querySelector('.no-results')
  if (visible === 0) {
    if (!noResults) {
      noResults = document.createElement('div')
      noResults.className = 'no-results'
      noResults.textContent = 'Aucune application trouvée.'
      appsGrid.appendChild(noResults)
    }
    noResults.style.display = 'block'
  } else if (noResults) {
    noResults.style.display = 'none'
  }
}

// Keyboard shortcut: focus search on '/'
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault()
    searchInput.focus()
  }
})
