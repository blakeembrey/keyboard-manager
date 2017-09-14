const { Keyboard } = require('..')

const keyboard = new Keyboard()
const outputEl = document.getElementById('key')

keyboard.attach()

keyboard.listen(function (combo) {
  outputEl.textContent = combo
})
