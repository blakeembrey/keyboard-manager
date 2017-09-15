# Shortcut Manager

[![NPM version](https://img.shields.io/npm/v/keyboard-manager.svg?style=flat)](https://npmjs.org/package/keyboard-manager)
[![NPM downloads](https://img.shields.io/npm/dm/keyboard-manager.svg?style=flat)](https://npmjs.org/package/keyboard-manager)
[![Build status](https://img.shields.io/travis/blakeembrey/keyboard-manager.svg?style=flat)](https://travis-ci.org/blakeembrey/keyboard-manager)
[![Test coverage](https://img.shields.io/coveralls/blakeembrey/keyboard-manager.svg?style=flat)](https://coveralls.io/r/blakeembrey/keyboard-manager?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/blakeembrey/keyboard-manager.svg)](https://greenkeeper.io/)

> Small keyboard shortcut management for DOM-based applications.

## Installation

```
npm install keyboard-manager --save
```

## Usage

```js
import { Keyboard, stringifyKey, createShortcuts } from 'keyboard-manager'

const keyboard = new Keyboard()
const shortcut1 = stringifyKey('cmd', 'a') //=> "65 91"
const shortcut2 = stringifyKey('cmd', 'up') //=> "38 91"

// Bind event listeners globally or to a key.
keyboard.addListener(createShortcuts({
  [shortcut1]: e => e.preventDefault(),
  [shortcut2]: e => e.preventDefault()
}))

// Attach event listener.
window.addEventListener('keydown', keyboard.getHandler(), false)

// Mount a keyboard listener inside another listener.
new Keyboard().addListener(keyboard.getListener())
```

**Tip:** Returning `true` from your listener function will enable shortcut propagation. This enables you to create arbitrary shortcut "scopes" in your keyboard stack. For instance, the second argument to `createShortcuts` is the return value (default: `true`), used when no shortcut matches, and can be set to `false` to disable propagation.

### Combined Shortcuts Pattern

```js
const dispatcher = new Keyboard()

// Create two `Keyboard` instances, allowing the globally unhandled shortcuts
// to propagate to the application shortcuts.
const appKeyboard = new Keyboard()
const globalKeyboard = new Keyboard()

// Dispatch order is determined by listeners, newest listeners execute first.
dispatcher.addListener(appKeyboard.getListener())
dispatcher.addListener(globalKeyboard.getListener()))
```

## How?

**Keyboard Manager** maps each `keydown` event to the character code (`e.which`) and modifiers (`e.shiftKey`, `e.ctrlKey`, `e.altKey`, `e.metaKey`).

### Why not use `keydown` and `keyup` for infinite combinations?

1. Mac OS doesn't emit `keyup` events while `cmd` is pressed
2. The DOM won't receive a `keyup` event when you lose focus on the window
3. Keyboard shortcuts don't usually combine non-modifier characters

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
