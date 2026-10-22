export function byCategory(list, cat) {
  return list.filter(item => item.category === cat)
}

export function search(list, text) {
  const termo = text.toLowerCase()

  return list.filter(item =>
    item.name.toLowerCase().includes(termo) ||
    item.tags.some(tag => tag.toLowerCase().includes(termo))
  )
}
export function total(list) {
  return list.reduce((sum, item) => sum + item.price, 0)
}
export function top(list, n) {
  return list
    .toSorted((a, b) => b.price - a.price)
    .slice(0, n)
}
export function categories(list) {
  return [...new Set(list.map(item => item.category))].toSorted()
}
export function withDiscount(list, pct) {
  return list.map(item => ({
    ...item,
    price: item.price * (1 - pct / 100)
  }))
}
export function sortByPrice(list, dir = 'asc') {
  return list.toSorted((a, b) =>
    dir === 'asc'
      ? a.price - b.price
      : b.price - a.price
  )
}