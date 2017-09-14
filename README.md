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

```ts
import { Keyboard } from 'keyboard-manager'

const keyboard = new Keyboard()

// Attach keyboard listener to the `window`.
keyboard.attach()
keyboard.detach()

// Bind event listeners globally or to a key.
keyboard.bind(['cmd', 'a'], (e) => e.preventDefault())
keyboard.listen((combo, e) => console.log(combo))

// Remove event listeners.
keyboard.unbind(['cmd', 'a'], ...)
keyboard.stopListening(...)
```

**Tip:** When a keyboard shortcut matches, only the final callback is executed. This allows keyboard shortcuts to be added throughout an application, and only the last bound callback will be trigged.

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
