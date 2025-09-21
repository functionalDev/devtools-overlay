<p>
   For now this is the package to add NEST developer tools to the page
</p>

# @devtools-overlay/overlay

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![version](https://img.shields.io/npm/v/@devtools-overlay/overlay?style=for-the-badge)](https://www.npmjs.com/package/@devtools-overlay/overlay)
[![npm](https://img.shields.io/npm/dw/@devtools-overlay/overlay?style=for-the-badge)](https://www.npmjs.com/package/@devtools-overlay/overlay)

An on-page devtools overlay for debugging NEST webapp without a chrome extension.

Simply add the call the overlay function and get access to a powerful, in-browser devtools experience during.

## Try it online!

🚧 TODO 🚧
A couple of deployed demo websites where you can see the Overlay in action:
🚧 TODO 🚧

- [Sandbox Website](https://thetarnav.github.io/devtools-overlay) - [Source code](https://github.com/thetarnav/solid-devtools/tree/main/examples/sandbox)

## Getting started

### Installation

```bash
npm i @devtools-overlay/overlay
# or
yarn add @devtools-overlay/overlay
# or
pnpm add @devtools-overlay/overlay
```

### Attach the overlay

Simply call the overlay component in the client entry file.

```tsx
import { attachDevtoolsOverlay } from '@devtools-overlay/overlay'

attachDevtoolsOverlay()

// or with some options

attachDevtoolsOverlay({
  defaultOpen: true, // or alwaysOpen
  noPadding: true,
})
```

🚧 TODO 🚧
~~Don't worry about wrapping it with a `isDev` guard, the Overlay takes care of that for you. It should be excluded from production builds automatically.~~

### Extending with custom tabs/modules

Custom tabs can be added to the devtools by passing the parameter `modules` to the overlay function.

#### With react
```ts
import { attachDevtoolsOverlay } from '@devtools-overlay/overlay'
import { render, hydrate } from 'react';

attachDevtoolsOverlay({
  modules: [{
    title: 'tab name',
    MainView: ({ openSidePanel }) => (
      <>
        <h2>
          This is the main view
        </h2>
        <div>
          <button onClick={() => openSidePanel(b => !b)}>
                  Open side panel
          </button>
        </div>
      </>
    ),
    SidePanel: () => (
      <div>
        <h3>This is the sidepanel</h3>
      </div>
    ),
    render: (Component, el) => render(<Component/>, el),
  }]
})
```

#### With solidjs
```ts
import { attachDevtoolsOverlay } from '@devtools-overlay/overlay'
import { render } from "solid-js/web";

attachDevtoolsOverlay({
  modules: [{
    title: 'tab name',
    MainView: ({ openSidePanel }) => (
      <>
        <h2>
          This is the main view
        </h2>
        <div>
          <button onClick={() => openSidePanel(b => !b)}>
                  Open side panel
          </button>
        </div>
      </>
    ),
    SidePanel: () => (
      <div>
        <h3>This is the sidepanel</h3>
      </div>
    ),
    render: (Component, el) => render(<Component/>, el),
  }]
})
```


## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
