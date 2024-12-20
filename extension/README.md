<a href="https://github.com/thetarnav/solid-devtools/tree/main/extension#readme" target="_blank">
  <p>
    <img width="100%" src="https://assets.solidjs.com/banner?type=Devtools&background=tiles&project=Chrome%20Extension" alt="Solid Devtools Extension">
  </p>
</a>

# Chrome Extension

[![version](https://img.shields.io/chrome-web-store/v/kmcfjchnmmaeeagadbhoofajiopoceel?label=version&style=for-the-badge)](https://chrome.google.com/webstore/detail/solid-devtools/kmcfjchnmmaeeagadbhoofajiopoceel)
[![users](https://img.shields.io/chrome-web-store/users/kmcfjchnmmaeeagadbhoofajiopoceel?label=users&style=for-the-badge)](https://chrome.google.com/webstore/detail/solid-devtools/kmcfjchnmmaeeagadbhoofajiopoceel)

🚧 In early development. 🚧

Chrome devtools extension for debugging Solid applications.
It allows for visualizing and interacting with Solid's reactivity graph, as well as inspecting component state and hierarchy.

Should work in any application using SolidJS, including SolidStart and Astro.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/24491503/203095796-4ca411d9-e377-4c2e-896e-f152172270cc.png">
  <img alt="Screenshot of the chrome extension" src="https://user-images.githubusercontent.com/24491503/203095712-1c4f904a-5a63-47ef-84e1-fc50e9e1c4d4.png">
</picture>

## Getting started

### 1. Install the chrome extension

The extension is now available on the Chrome Web Store. You can install it when using a chromium-based browser by clicking the "Install" button.

[**Solid Devtools Chrome Extension**](https://chrome.google.com/webstore/detail/solid-devtools/kmcfjchnmmaeeagadbhoofajiopoceel)

### 2. Install the debugger library

If you think about the Chrome Extension as a **Frontend**, then the [**"solid-devtools"**](https://github.com/thetarnav/solid-devtools/blob/main/packages/main#readme) npm package is its **Backend**. It debugs the Solid's reactivity and communicates the updates to the Chrome Extension.

Install the following package:

```bash
npm i -D solid-devtools
# or
yarn add -D solid-devtools
# or
pnpm add -D solid-devtools
```

> **Note**
> The extension will usually require the latest version of the debugger library.
> As the devtools are in active development, the debugger library and the extension change frequently, often breaking backward compatibility with older versions. This is why need to watch out for version mismatches _(will be printed to the console)_.

### 3. Add devtools vite plugin

The task of the vite plugin is to enchance the debugging experience by applying additional transforms to your code. That is the recommended way to use the devtools, but it is not required. You can still use the devtools without the plugin, with only the runtime part, but some features will be missing.

> **Note**
> As **vite** is the default bundler used by solid application and starter, the devtools are currently concerned with supporting only it.

To get the debugger working include the vite plugin from `"solid-devtools/vite"` in your vite config. Enabling some of the options, such as `"autoname"`, will improve the debugging experience or enable additional features.

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid' // or solid-start/vite
import devtools from 'solid-devtools/vite'

export default defineConfig({
  plugins: [
    devtools({
      /* features options - all disabled by default */
      autoname: true, // e.g. enable autoname
    }),
    solid(),
  ],
})
```

[**>> More about available transform options**](https://github.com/thetarnav/solid-devtools/tree/main/packages/main#options)

### 4. Import the devtools runtime

The plugin doesn't automatically import the devtools runtime. You need to import it manually in your application's client-side entry point.

The runtime is important for exposing the devtools API to the extension.

```ts
// src/index.tsx or src/client-entry.tsx

import 'solid-devtools'
// or from 'solid-devtools/setup' if you're not using the vite plugin
```

### 5. Run the app and play with the devtools!

A new **"Solid"** panel should appear after you open the Chrome devtools panel.

![visible solid devtools panel](https://user-images.githubusercontent.com/24491503/209223131-1fe8a44f-4044-4a95-b4ed-12d993fb79a0.png)

The extension is in its early development stages. We are constantly working on it to make it better, add new features and improve the user experience. We appreciate your feedback and suggestions.

If you run to any issues, or have any suggestions, please [open an issue](https://github.com/thetarnav/solid-devtools/issues).

If you are interested in the extension's development, see the [contribution guide](https://github.com/thetarnav/solid-devtools/blob/main/CONTRIBUTING.md).

## DEMO

This Stackblitz demo is setup to work with the extension.

[**See this Stackblitz demo.**](https://stackblitz.com/edit/solid-devtools-demo?file=src%2Fmain.tsx)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
