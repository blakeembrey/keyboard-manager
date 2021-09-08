/**
 * Custom keyboard event interface with looser requirements than the native browser keyboard event, helpful for testing.
 */
export interface Event {
  key?: string;
  target?: EventTarget | HTMLElement | null;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

/**
 * Keyboard event listener.
 */
export type KeyboardEventListener = (event: Event) => void;

/**
 * Source: https://github.com/madrobby/keymaster/blob/3b1f2afabf1569848dea8b697ac418f19b601a30/keymaster.js
 */
export const KEY_MAP = new Map<string, string>([
  ["option", "alt"],
  ["ctrl", "control"],
  ["os", "meta"],
  ["cmd", "meta"],
  ["command", "meta"],
  ["caps", "capslock"],
  ["return", "enter"],
  ["esc", "escape"],
  ["space", " "],
  ["spacebar", " "],
  ["left", "arrowleft"],
  ["up", "arrowup"],
  ["right", "arrowright"],
  ["down", "arrowdown"],
  ["scroll", "scrolllock"],
  ["del", "delete"],
  ["apps", "contextmenu"],
]);

/**
 * Continue propagating the event to older listeners.
 */
export const SHOULD_PROPAGATE = true;

/**
 * Normalize a key value to standard format.
 */
export function normalizeKey(key: string | undefined): string {
  const value = String(key).toLocaleLowerCase();
  return KEY_MAP.get(value) || value;
}

/**
 * Stringify a keyboard event.
 */
export function keyboardEventCombo(e: Event): string {
  const keys = new Set<string | undefined>([e.key]);

  if (e.shiftKey) keys.add("shift");
  if (e.ctrlKey) keys.add("control");
  if (e.altKey) keys.add("alt");
  if (e.metaKey) keys.add("meta");

  return stringifyKey(...keys);
}

/**
 * Map keys to string.
 */
export function stringifyKey(...keys: (string | undefined)[]): string {
  return keys.map(normalizeKey).sort().join(" ");
}

/**
 * Keyboard event handler.
 */
export type KeyHandler = (event: Event, key: string) => void | boolean;

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
export function isInputEvent(event: Event): boolean {
  const { target } = event;

  return (
    !!target &&
    "tagName" in target &&
    (target.tagName === "INPUT" ||
      target.tagName === "SELECT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable)
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

  addListener(callback: KeyHandler): void {
    this.listeners.add(callback);
  }

  removeListener(callback: KeyHandler): void {
    this.listeners.delete(callback);
  }

  getHandler(): KeyboardEventListener {
    const listener = this.getListener();

    return (event: Event) => {
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
