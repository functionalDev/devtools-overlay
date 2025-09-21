<p>Framework agnostic customizable Devtools</p>

# Developer Tools

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![npm](https://img.shields.io/npm/dw/@solid-devtools/shared?color=blue&style=for-the-badge)](https://www.npmjs.com/package/solid-devtools)

Library of developer tools & ~~Devtools Chrome extension~~ for stuff. To lazy to write anything meaningful now.

## Why?

To change the way you write, debug and present your applications.


// TODO update images and link to chrome extension

<a href="https://chrome.google.com/webstore/detail/solid-devtools/kmcfjchnmmaeeagadbhoofajiopoceel">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/24491503/203095796-4ca411d9-e377-4c2e-896e-f152172270cc.png">
    <img alt="Screenshot of the chrome extension" src="https://png.pngtree.com/png-vector/20250825/ourlarge/pngtree-tiny-devtools-website-icon-monochrome-on-white-background-png-image_17238680.webp">
  </picture>
</a>

## [The Chrome Extension](./extension#readme)

🚧 For now abandoned 🚧

Chrome Developer Tools extension for debugging applications. It allows for visualizing and interacting with Solid's reactivity graph, as well as inspecting component state and hierarchy.

Should work in any application using JS.

[**>> See the guide on setting started <<**](./extension#getting-started)

## All devtools packages

Most of the present packages are not much more then just ideas and experiments. Some in progress, and some very much in progress.
But few of them can help you in your work already, and a man can dream, so this is what's out there waiting:

### [Extension Client](./packages/main#readme)

###### `devtools`

The main client library. It reexports the most important tools and connects the client application to the chrome extension.

[**See README for more information.**](./packages/main#readme)

### [Devtools Overlay](./packages/overlay#readme)

###### `devtools/overlay`

An on-page devtools overlay for debugging applications without a chrome extension.

[**See guide on setting up**](./packages/overlay#getting-started)

### [Logger](./packages/logger#readme)

###### `devtools/logger`

For debugging only the pinpoint places parts of the Solid's reactivity graph you are concerned with, right in the console you use all the time.

Provides a variaty of debugging utilities for logging the state and lifecycle of .... to the browser console.

## Resources and prior art

A couple of resources on the topic on chrome devtools extensions:

- [about devtools](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Extending_the_developer_tools)
- [Content-script <-> background-script communication](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/Port)
- [Article about vue devtools](https://dev.to/voluntadpear/how-a-devtools-extension-is-made-1em7#bridge)
- [Manifest.json anatomy](https://developer.chrome.com/docs/extensions/mv3/manifest/)
- [setting up vite plugin](https://dev.to/jacksteamdev/create-a-vite-react-chrome-extension-in-90-seconds-3df7)
- [example react project](https://github.com/jacksteamdev/crx-react-devtools):
  - [injecting real-world scripts](https://github.com/jacksteamdev/crx-react-devtools/blob/main/src/content-script.ts) _(for accessing the real window object)_
- [Plugin architecture of Vue Devtools](https://devtools.vuejs.org/plugin/plugins-guide.html#architecture)

Other devtools projects:

- [CM-Tech/solid-debugger](https://github.com/CM-Tech/solid-debugger)
- [Svelte Devtools](https://github.com/sveltejs/svelte-devtools)
- [Vue Devtools](https://github.com/vuejs/devtools)
- [MobX Devtools](https://github.com/mobxjs/mobx-devtools)
- [React Devtools](https://react-devtools-experimental.vercel.app)
- [Preact Devtools](https://github.com/preactjs/preact-devtools)
- [LocatorJS](https://www.locatorjs.com)
