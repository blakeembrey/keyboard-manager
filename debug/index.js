const { Keyboard } = require('..')

const keyboard = new Keyboard()
const outputEl = document.getElementById('key')

keyboard.addListener(function (e, combo) {
  e.preventDefault()

  outputEl.textContent = combo
})

window.addEventListener('keydown', keyboard.getHandler(), false)
