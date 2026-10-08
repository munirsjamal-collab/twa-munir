import { writeFile } from 'node:fs/promises'

import { items } from './data.js'

import {
  byCategory,
  search,
  total,
  top,
  categories
} from './catalogo.js'

const [cmd, arg] = process.argv.slice(2)

if (!cmd) {
  console.log(items)

} else if (cmd === 'search') {
  console.log(search(items, arg))

} else if (cmd === 'top') {
  console.log(top(items, Number(arg)))

} else if (cmd === 'report') {

  const report = {
    numberOfItems: items.length,
    total: Number(total(items).toFixed(2)),
    categories: categories(items),
    top3: top(items, 3)
  }

  await writeFile(
    'report.json',
    JSON.stringify(report, null, 2),
    'utf8'
  )

  console.log('report.json criado com sucesso.')

} else {
  console.log(byCategory(items, cmd))
}