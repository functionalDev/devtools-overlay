# @devtoolsoverlay/frontend


[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![version](https://img.shields.io/npm/v/@devtoolsoverlay/frontend?style=for-the-badge)](https://www.npmjs.com/package/@devtoolsoverlay/frontend)
[![npm](https://img.shields.io/npm/dw/@devtoolsoverlay/frontend?style=for-the-badge)](https://www.npmjs.com/package/@devtoolsoverlay/frontend)

The frontend of the devtools extension & overlay as a npm package, so it can be embedded in different projects.

## Try it online!

🚧 TODO 🚧
A couple of deployed demo websites where you can see the Overlay in action:
🚧 TODO 🚧


## Getting started

### Installation

```bash
npm i @devtoolsoverlay/frontend
# or
yarn add @devtoolsoverlay/frontend
# or
pnpm add @devtoolsoverlay/frontend
```


### The controller

🚧 TODO 🚧
The devtools frontend is controlled with a `Controller` API. It provides a set of methods to trigger actions, and a way to get events from the devtools frontend.
🚧 TODO 🚧

```ts
const controller = new Controller({
  onDevtoolsLocatorStateChange(enabled) {
    console.log(enabled)
  },
  onHighlightElementChange(data) {
    console.log(data)
  },
  onInspectNode(data) {
    console.log(data)
  },
  onInspectValue(data) {
    console.log(data)
  },
})
```

This package is continuously under development, so the API is still not well defined. So instead of focusing on the API, the usage examples should show how you can embed this package in different context.

- [Chrome Extension](https://github.com/functionalDev/devtools-overlay/tree/blob/main/extension/src/App.tsx) - ~~The extension is communicating with the [debugger](https://github.com/thetarnav/solid-devtools/tree/main/packages/debugger#readme) using the [main](https://github.com/thetarnav/solid-devtools/tree/main/packages/main/src) npm package.~~

- [Overlay component](https://github.com/functionalDev/devtools-overlay/blob/main/packages/overlay/src/controller.ts) 🚧🚧

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
