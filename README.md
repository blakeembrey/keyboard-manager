# Keyboard Manager

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][build-image]][build-url]
[![Build coverage][coverage-image]][coverage-url]
[![Bundle size][size-image]][size-url]

> Small keyboard shortcut management for DOM-based applications.

## Installation

```
npm install keyboard-manager --save
```

## Usage

**Keyboard Manager** uses a simple queue, processed from newest to oldest, of listener functions to execute keyboard shortcuts. Keyboard event propagation stops when handled, but returning `true` from the listener will continue propagation to older listeners.

```js
import { Keyboard, stringifyKey, createShortcuts } from "keyboard-manager";

const keyboard = new Keyboard();
const shortcut1 = stringifyKey("cmd", "a"); //=> "65 91"
const shortcut2 = stringifyKey("cmd", "up"); //=> "38 91"

// Bind event listeners to all combos or specific keys using `createShortcuts`.
keyboard.addListener(
  createShortcuts({
    [shortcut1]: (e) => e.preventDefault(),
    [shortcut2]: (e) => e.preventDefault(),
  })
);

// Attach event listener to document.
window.addEventListener("keydown", keyboard.getHandler(), false);

// Mount a keyboard inside another listener.
new Keyboard().addListener(keyboard.getListener());
```

### Stringify Key

The `stringifyKey(...keys)` function returns a consistent identity string for the keyboard shortcut. Internally, `keyboardEventCombo(e)` will map keyboard events to the matching string.

### Create Shortcuts

The `createShortcuts(map [, returnValue])` function accepts a map of keyboard shortcut functions and returns a single listener function for mounting with `keyboard.addListener(callback)`.

**Tip:** `returnValue` defaults to `true` for propagation. Setting to `false` will stop propagation, effectively creating a new shortcut "scope". This is useful for features, such as full-screen modals or recording keyboard shortcuts, where key presses should not interact with the rest of the document.

### Filter Input Event

Wrap any listener in `filterInputEvent(callback)` to automatically ignore and propagate events originating from an input-like element (`<input />`, `<select />`, `<textarea />` or content-editable elements).

```js
import {
  stringifyKey,
  createShortcuts,
  filterInputEvent,
} from "keyboard-manager";

const listener = createShortcuts({
  [stringifyKey("a")]: filterInputEvent((e) => e.preventDefault()),
});
```

### Combined Shortcuts Pattern

```js
const dispatcher = new Keyboard()

// Create two `Keyboard` instances, allowing globally unhandled shortcuts
// to propagate into application shortcuts (i.e. OS-like functionality).
const appKeyboard = new Keyboard()
const globalKeyboard = new Keyboard()

// Dispatch order is determined by listeners, recent listeners execute first.
dispatcher.addListener(appKeyboard.getListener())
dispatcher.addListener(globalKeyboard.getListener()))
```

## How?

**Keyboard Manager** serializes each `keydown` event to the character (`e.key`) and modifiers (`e.shiftKey`, `e.ctrlKey`, `e.altKey`, `e.metaKey`). For example, `cmd + a` maps to `meta a`.

### Why not use `keydown` and `keyup` for infinite key combos?

1. Mac OS doesn't emit `keyup` events while `cmd` is pressed.
2. The DOM won't receive a `keyup` event when you lose focus on the window.
3. Keyboard shortcuts don't need to combine non-modifier characters.

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0

[npm-image]: https://img.shields.io/npm/v/keyboard-manager
[npm-url]: https://npmjs.org/package/keyboard-manager
[downloads-image]: https://img.shields.io/npm/dm/keyboard-manager
[downloads-url]: https://npmjs.org/package/keyboard-manager
[build-image]: https://img.shields.io/github/workflow/status/blakeembrey/keyboard-manager/CI/main
[build-url]: https://github.com/blakeembrey/keyboard-manager/actions/workflows/ci.yml?query=branch%3Amain
[coverage-image]: https://img.shields.io/codecov/c/gh/blakeembrey/keyboard-manager
[coverage-url]: https://codecov.io/gh/blakeembrey/keyboard-manager
[size-image]: https://img.shields.io/bundlephobia/minzip/keyboard-manager
[size-url]: https://bundlephobia.com/result?p=keyboard-manager
