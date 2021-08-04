/**
 * Source: https://github.com/madrobby/keymaster/blob/3b1f2afabf1569848dea8b697ac418f19b601a30/keymaster.js
 */
export const KEY_MAP = new Map<string, string>([
  ["⇧", "shift"],
  ["⌥", "alt"],
  ["option", "alt"],
  ["⌃", "control"],
  ["ctrl", "control"],
  ["⌘", "meta"],
  ["cmd", "meta"],
  ["command", "meta"],
  ["caps", "capslock"],
  ["tab", "tab"],
  ["return", "enter"],
  ["esc", "escape"],
  ["space", " "],
  ["left", "arrowleft"],
  ["up", "arrowup"],
  ["right", "arrowright"],
  ["down", "arrowdown"]
]);

/**
 * Continue propagating the event to older listeners.
 */
export const SHOULD_PROPAGATE = true;

/**
 * Normalize a key value to standard format.
 */
export function normalizeKey(key: string): string {
  const value = String(key).toLocaleLowerCase();
  return KEY_MAP.get(value) || value;
}

/**
 * Stringify a keyboard event.
 */
export function keyboardEventCombo(e: KeyboardEvent) {
  const keys = new Set<string>([normalizeKey(e.key)]);

  if (e.shiftKey) keys.add("shift");
  if (e.ctrlKey) keys.add("control");
  if (e.altKey) keys.add("alt");
  if (e.metaKey) keys.add("meta");

  return Array.from(keys)
    .sort()
    .join(" ");
}

/**
 * Map keys to string.
 */
export function stringifyKey(...keys: string[]) {
  return keys
    .map(normalizeKey)
    .sort()
    .join(" ");
}

/**
 * Keyboard event handler.
 */
export type KeyHandler = (e: KeyboardEvent, combo: string) => void | boolean;

/**
 * Keyboard shortcut map.
 */
export interface Shortcuts {
  [key: string]: KeyHandler;
}

/**
 * Create a listener function from shortcuts.
 */
export function createShortcuts(
  shortcuts: Shortcuts,
  returnValue = SHOULD_PROPAGATE
): KeyHandler {
  return (event, combo) => {
    return shortcuts[combo] ? shortcuts[combo](event, combo) : returnValue;
  };
}

/**
 * Check if a keyboard event originated from an input.
 */
export function isInputEvent(event: KeyboardEvent) {
  const target = event.target as HTMLElement;

  return (
    target.tagName === "INPUT" ||
    target.tagName === "SELECT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  );
}

/**
 * Function to wrap listener by filtering input events.
 */
export function filterInputEvent(listener: KeyHandler): KeyHandler {
  return (event, combo) => {
    return isInputEvent(event) ? SHOULD_PROPAGATE : listener(event, combo);
  };
}

/**
 * Keyboard manager library for mapping key events.
 */
export class Keyboard {
  listeners = new Set<KeyHandler>();

  addListener(callback: KeyHandler) {
    this.listeners.add(callback);
  }

  removeListener(callback: KeyHandler) {
    this.listeners.delete(callback);
  }

  getHandler() {
    const listener = this.getListener();

    return (event: KeyboardEvent) => {
      listener(event, keyboardEventCombo(event));
    };
  }

  getListener(returnValue = SHOULD_PROPAGATE): KeyHandler {
    return (event, combo) => {
      const listeners = Array.from(this.listeners);
      let length = listeners.length;

      while (length--) {
        const result = listeners[length](event, combo);
        if (result !== SHOULD_PROPAGATE) return;
      }

      return returnValue;
    };
  }
}
