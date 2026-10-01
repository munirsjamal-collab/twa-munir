let contador = 10

document.querySelector('#app').innerHTML = `
  <h1 id="contador">${contador}</h1>
`

const elemento = document.querySelector('#contador')

document.title = `Contador: ${contador}`

const intervalo = setInterval(() => {
  contador--

  elemento.textContent = contador
  document.title = `Contador: ${contador}`

  if (contador <= 0) {
    clearInterval(intervalo)
  }
}, 1000)
