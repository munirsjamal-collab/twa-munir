import { writeFile } from 'fs/promises'

const res = await fetch(
    'https://api.github.com/repos/nodejs/node'
)

if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
}

const repo = await res.json()

console.log(repo.name)
console.log(repo.stargazers_count)

const dados = {
    name: repo.name,
    stars: repo.stargazers_count
}

await writeFile(
    'repo.json',
    JSON.stringify(dados, null, 2),
    'utf8'
)

console.log('repo.json criado com sucesso.')
