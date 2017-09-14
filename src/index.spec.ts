import { Keyboard } from './'

describe('keyboard manager', () => {
  it('should manage keyboard shortcuts', () => {
    let triggered = 0

    const keyboard = new Keyboard()
    const callback = () => triggered++
    const event: any = { which: 'A'.charCodeAt(0), metaKey: true }

    keyboard.bind(['cmd', 'a'], callback)
    keyboard.onKeyDown(event)
    keyboard.unbind(['cmd', 'a'], callback)
    keyboard.onKeyDown(event)
    keyboard.unbind(['cmd', 'a'], callback)

    expect(triggered).toEqual(1)
  })
})
