import { Keyboard, createShortcuts, stringifyKey } from './'

describe('keyboard manager', () => {
  it('should manage keyboard shortcuts', () => {
    let triggered = 0

    const keyboard = new Keyboard()
    const event1: any = { which: 'A'.charCodeAt(0), metaKey: true }
    const event2: any = { which: 0 }
    const handler = keyboard.getHandler()

    const listener = createShortcuts({
      [stringifyKey('cmd', 'a')]: () => triggered++
    })

    keyboard.addListener(listener)

    handler(event1)
    handler(event2)

    keyboard.removeListener(listener)

    handler(event1)
    handler(event2)

    expect(triggered).toEqual(1)
  })

  it('should support a "global" pattern', () => {
    const dispatcher = new Keyboard()
    const handler = dispatcher.getHandler()

    let appTriggered = 0
    let globalTriggered = 0

    const appKeyboard = new Keyboard()
    const globalKeyboard = new Keyboard()

    dispatcher.addListener(appKeyboard.getListener())
    dispatcher.addListener(globalKeyboard.getListener())

    globalKeyboard.addListener(createShortcuts({
      [stringifyKey('cmd', 'a')]: () => globalTriggered++
    }))

    appKeyboard.addListener(createShortcuts({
      [stringifyKey('a')]: () => appTriggered++,
      [stringifyKey('cmd', 'a')]: () => appTriggered++
    }))

    handler({ which: 'A'.charCodeAt(0), metaKey: true } as any)

    expect(appTriggered).toEqual(0)
    expect(globalTriggered).toEqual(1)

    handler({ which: 'A'.charCodeAt(0) } as any)

    expect(appTriggered).toEqual(1)
    expect(globalTriggered).toEqual(1)
  })
})
