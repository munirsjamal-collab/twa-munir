import assert from 'node:assert/strict'

import { items } from './data.js'

import {
  byCategory,
  search,
  total,
  top,
  categories,
  withDiscount,
  sortByPrice
} from './src/catalogo.js'

assert.equal(items.length, 8)

assert.equal(
  byCategory(items, 'programming').length,
  4
)

assert.equal(
  search(items, 'clean').length,
  1
)

assert.equal(
  search(items, 'javascript').length,
  2
)

assert.equal(
  top(items, 3).length,
  3
)

assert.deepEqual(
  categories(items),
  ['fantasy', 'fiction', 'programming', 'science-fiction']
)

assert.equal(
  Number(total(items).toFixed(2)),
  199.29
)

const discounted = withDiscount(items, 10)

assert.equal(
  Number(discounted[0].price.toFixed(2)),
  29.25
)

assert.equal(
  items[0].price,
  32.50
)

console.log('Todos os testes passaram.')

const ordenadoAsc = sortByPrice(items, 'asc')
const ordenadoDesc = sortByPrice(items, 'desc')

assert.equal(ordenadoAsc[0].price, 14.9)
assert.equal(ordenadoDesc[0].price, 35)