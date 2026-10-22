import {
  search,
  byCategory,
  categories,
  sortByPrice
} from './catalogo.js'

const state = {
  status: 'loading',
  error: null,
  items: [],
  query: '',
  category: '',
  sortDir: 'desc',
  selectedId: null
}
async function load() {
  state.status = 'loading'
  state.error = null

  render()

  try {
    const res = await fetch('/items.json')

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const text = await res.text()

    if (text.trim().startsWith('<')) {
      throw new Error('Resposta inválida: foi recebido HTML em vez de JSON')
    }

    state.items = JSON.parse(text)
    state.status = 'ready'

  } catch (error) {
    state.status = 'error'
    state.error = error.message

  } finally {
    render()
  }
}
function render() {
  const listEl = document.querySelector('#list')
  const detailEl = document.querySelector('#detail')
  const categoryEl = document.querySelector('#category')

  if (state.status === 'loading') {
    listEl.innerHTML = '<li>A carregar...</li>'
    return
  }

  if (state.status === 'error') {
    listEl.innerHTML = `
      <li>
        Erro: ${state.error}
        <button id="retry">Tentar novamente</button>
      </li>
    `

    document.querySelector('#retry')
      ?.addEventListener('click', load)

    return
  }

  let result = state.items

  if (state.query) {
    result = search(result, state.query)
  }

  if (state.category) {
    result = byCategory(result, state.category)
  }

  result = sortByPrice(result, state.sortDir)

  listEl.replaceChildren(
    ...result.map(item => {
      const li = document.createElement('li')

      li.textContent = `${item.name} — ${item.price} €`

      li.addEventListener('click', () => {
        state.selectedId = item.id
        render()
      })

      return li
    })
  )

  const selected = state.items.find(
    item => item.id === state.selectedId
  )

  if (selected) {
    detailEl.replaceChildren(
      createDetail(selected)
    )
  } else {
    detailEl.replaceChildren()
  }

  if (categoryEl.options.length === 1) {
    categories(state.items).forEach(cat => {
      const option = document.createElement('option')
      option.value = cat
      option.textContent = cat
      categoryEl.appendChild(option)
    })
  }
}
function createDetail(item) {
  const div = document.createElement('div')

  const title = document.createElement('h2')
  title.textContent = item.name

  const price = document.createElement('p')
  price.textContent = `Preço: ${item.price} €`

  const tags = document.createElement('p')
  tags.textContent = `Tags: ${item.tags.join(', ')}`

  const author = document.createElement('p')
  author.textContent =
    `Autor: ${item.author.name} (${item.author.country})`

  div.append(
    title,
    price,
    tags,
    author
  )

  return div
}
document
  .querySelector('#search')
  .addEventListener('input', event => {
    state.query = event.target.value
    render()
  })
document
  .querySelector('#category')
  .addEventListener('change', event => {
    state.category = event.target.value
    render()
  })
document
  .querySelector('#sort')
  .addEventListener('click', () => {
    state.sortDir =
      state.sortDir === 'asc'
        ? 'desc'
        : 'asc'

    render()
  })
load()