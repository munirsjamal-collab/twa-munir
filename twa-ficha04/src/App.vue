<script setup>
import { ref, computed, onMounted } from 'vue'

import {
  search,
  byCategory,
  categories,
  sortByPrice
} from './catalogo.js'

const status = ref('loading')
const error = ref(null)
const items = ref([])

const query = ref('')
const category = ref('')
const sortDir = ref('desc')
const selectedId = ref(null)

async function load() {
  status.value = 'loading'
  error.value = null

  try {
    const res = await fetch('/items.json')

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const text = await res.text()

    if (text.trim().startsWith('<')) {
      throw new Error('Resposta inválida: foi recebido HTML em vez de JSON')
    }

    items.value = JSON.parse(text)
    status.value = 'ready'

  } catch (err) {
    status.value = 'error'
    error.value = err.message
  }
}

const cats = computed(() => {
  return categories(items.value)
})

const visible = computed(() => {
  let result = items.value

  if (query.value) {
    result = search(result, query.value)
  }

  if (category.value) {
    result = byCategory(result, category.value)
  }

  return sortByPrice(result, sortDir.value)
})

const selected = computed(() => {
  return items.value.find(
    item => item.id === selectedId.value
  )
})

function toggleSort() {
  sortDir.value =
    sortDir.value === 'asc'
      ? 'desc'
      : 'asc'
}

onMounted(() => {
  load()
})
</script>

<template>
  <main>
    <h1>Catálogo</h1>

    <input
      v-model="query"
      type="text"
      placeholder="Pesquisar..."
    >

    <select v-model="category">
      <option value="">
        Todas as categorias
      </option>

      <option
        v-for="cat in cats"
        :key="cat"
        :value="cat"
      >
        {{ cat }}
      </option>
    </select>

    <button @click="toggleSort">
      Ordenar por preço
    </button>

    <p v-if="status === 'loading'">
      A carregar...
    </p>

    <div v-else-if="status === 'error'">
      <p>Erro: {{ error }}</p>

      <button @click="load">
        Tentar novamente
      </button>
    </div>

    <ul v-else>
      <li
        v-for="item in visible"
        :key="item.id"
        :class="{ selected: item.id === selectedId }"
        @click="selectedId = item.id"
      >
        {{ item.name }} — {{ item.price.toFixed(2) }} €
      </li>
    </ul>

    <section
      v-if="selected"
      id="detail"
    >
      <h2>{{ selected.name }}</h2>

      <p>
        Preço: {{ selected.price.toFixed(2) }} €
      </p>

      <p>
        Tags: {{ selected.tags.join(', ') }}
      </p>

      <p>
        Autor: {{ selected.author.name }}
      </p>

      <p>
        País: {{ selected.author.country }}
      </p>
    </section>
  </main>
</template>

<style scoped>
main {
  max-width: 800px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}

input,
select,
button {
  margin: 5px;
  padding: 8px;
}

li {
  cursor: pointer;
  padding: 8px;
}

li:hover {
  background: #eeeeee;
}

.selected {
  font-weight: bold;
  background: #dddddd;
}

#detail {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #cccccc;
}
</style>