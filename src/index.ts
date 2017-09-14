/**
 * Source: https://github.com/madrobby/keymaster/blob/3b1f2afabf1569848dea8b697ac418f19b601a30/keymaster.js
 */
export const keyMap: { [code: string]: number } = {
  '⇧': 16, shift: 16,
  '⌥': 18, alt: 18, option: 18,
  '⌃': 17, ctrl: 17, control: 17,
  '⌘': 91, cmd: 91, command: 91, meta: 91,
  caps: 20, capslock: 20,
  backspace: 8, tab: 9, clear: 12,
  enter: 13, return: 13,
  esc: 27, escape: 27, space: 32,
  left: 37, up: 38,
  right: 39, down: 40,
  del: 46, delete: 46,
  home: 36, end: 35,
  pageup: 33, pagedown: 34,
  ',': 188, '.': 190, '/': 191,
  '`': 192, '-': 189, '=': 187,
  ';': 186, '\'': 222,
  '[': 219, ']': 221, '\\': 220
}

/**
 * Valid modifier keys.
 */
export const modifiers = [16, 17, 18, 91, 93, 224]

/**
 * Stringify a keyboard event.
 */
export function stringifyKey (e: KeyboardEvent) {
  const keys = []

  if (e.shiftKey) keys.push(keyMap.shift)
  if (e.ctrlKey) keys.push(keyMap.ctrl)
  if (e.altKey) keys.push(keyMap.alt)
  if (e.metaKey) keys.push(keyMap.meta)
  if (modifiers.indexOf(e.which) === -1) keys.push(e.which)

  return keys.sort().join(' ')
}

/**
 * Event handlers.
 */
export type EventHandler = (e: KeyboardEvent) => void
export type ListenerHandler = (combo: string, e: KeyboardEvent) => void

/**
 * Keyboard manager library for mapping key events.
 */
export class Keyboard {

  listeners: ListenerHandler[] = []
  shortcuts: { [key: string]: EventHandler[] } = Object.create(null)

  constructor (public map = keyMap) {
    // Listen and map to shortcut handler.
    this.listen((combo, e) => {
      const callbacks = this.shortcuts[combo]
      if (!callbacks) return
      const callback = callbacks[callbacks.length - 1]
      callback(e)
    })
  }

  onKeyDown: EventHandler = (e) => {
    const combo = stringifyKey(e)

    for (const callback of this.listeners) callback(combo, e)
  }

  mapKeys (keys: string | (string | number)[]) {
    if (!Array.isArray(keys)) return keys

    return keys.map(key => {
      if (typeof key === 'number') return key
      if (this.map[key]) return this.map[key]
      if (key.length > 1) throw new TypeError(`Unknown key: ${key}`)
      return key.toUpperCase().charCodeAt(0)
    }).sort().join(' ')
  }

  listen (callback: ListenerHandler) {
    return this.listeners.push(callback)
  }

  stopListening (callback: ListenerHandler) {
    const indexOf = this.listeners.indexOf(callback)
    if (indexOf > -1) this.listeners.splice(indexOf, 1)
    return indexOf
  }

  bind (keys: string | string[], callback: EventHandler) {
    const key = this.mapKeys(keys)
    if (!this.shortcuts[key]) this.shortcuts[key] = []
    return this.shortcuts[key].push(callback)
  }

  unbind (keys: string | string[], callback: EventHandler) {
    const key = this.mapKeys(keys)

    if (!this.shortcuts[key]) return -1

    const indexOf = this.shortcuts[key].indexOf(callback)
    if (indexOf > -1) this.shortcuts[key].splice(indexOf)
    if (!this.shortcuts[key].length) delete this.shortcuts[key]
    return indexOf
  }

  attach (element = window) {
    element.addEventListener('keydown', this.onKeyDown, false)
  }

  detach (element = window) {
    element.removeEventListener('keydown', this.onKeyDown, false)
  }

}
