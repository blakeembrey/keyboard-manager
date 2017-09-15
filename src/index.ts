/**
 * Source: https://github.com/madrobby/keymaster/blob/3b1f2afabf1569848dea8b697ac418f19b601a30/keymaster.js
 */
export const KEY_MAP: { [code: string]: number } = {
  '⇧': 16, shift: 16,
  '⌥': 18, alt: 18, option: 18,
  '⌃': 17, ctrl: 17, control: 17,
  '⌘': 91, cmd: 91, command: 91, meta: 91,
  caps: 20, capslock: 20,
  backspace: 8, tab: 9, clear: 12,
  enter: 13, return: 13,
  esc: 27, escape: 27, space: 32,
  left: 37, up: 38, right: 39, down: 40,
  del: 46, delete: 46,
  home: 36, end: 35, pageup: 33, pagedown: 34,
  ',': 188, '.': 190, '/': 191,
  '`': 192, '-': 189, '=': 187,
  ';': 186, '\'': 222,
  '[': 219, ']': 221, '\\': 220
}

/**
 * Valid modifier keys.
 */
export const MODIFIERS = [16, 17, 18, 91, 93, 224]

/**
 * Continue propagating the event to older listeners.
 */
export const SHOULD_PROPAGATE = true

/**
 * Stringify a keyboard event.
 */
export function keyboardEventCombo (e: KeyboardEvent) {
  const keys = []

  if (e.shiftKey) keys.push(KEY_MAP.shift)
  if (e.ctrlKey) keys.push(KEY_MAP.ctrl)
  if (e.altKey) keys.push(KEY_MAP.alt)
  if (e.metaKey) keys.push(KEY_MAP.meta)
  if (MODIFIERS.indexOf(e.which) === -1) keys.push(e.which)

  return keys.sort().join(' ')
}

/**
 * Map keys to string.
 */
export function stringifyKey (...keys: (string | number)[]) {
  return keys.map(key => {
    if (typeof key === 'number') return key
    if (KEY_MAP[key]) return KEY_MAP[key]
    if (key.length !== 1) throw new TypeError(`Unknown key "${key}"`)
    return key.toUpperCase().charCodeAt(0)
  }).sort().join(' ')
}

/**
 * Event handlers.
 */
export type EventHandler = (e: KeyboardEvent) => void
export type ListenerHandler = (combo: string, e: KeyboardEvent) => void | boolean

/**
 * Keyboard shortcut map.
 */
export interface Shortcuts {
  [key: string]: EventHandler
}

/**
 * Create a listener function from shortcuts.
 */
export function createShortcuts (shortcuts: Shortcuts, returnValue = SHOULD_PROPAGATE): ListenerHandler {
  return function (combo, event) {
    return shortcuts[combo] ? shortcuts[combo](event) : returnValue
  }
}

/**
 * Keyboard manager library for mapping key events.
 */
export class Keyboard {

  listeners: ListenerHandler[] = []

  addListener (callback: ListenerHandler) {
    return this.listeners.push(callback)
  }

  removeListener (callback: ListenerHandler) {
    const indexOf = this.listeners.indexOf(callback)
    if (indexOf > -1) this.listeners.splice(indexOf, 1)
    return indexOf
  }

  getHandler () {
    const listener = this.getListener()

    return (event: KeyboardEvent) => {
      return listener(keyboardEventCombo(event), event)
    }
  }

  getListener (returnValue = SHOULD_PROPAGATE): ListenerHandler {
    return (combo, event) => {
      let len = this.listeners.length

      while (len--) {
        if (this.listeners[len](combo, event) !== SHOULD_PROPAGATE) return undefined
      }

      return returnValue
    }
  }

}
