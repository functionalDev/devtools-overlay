if (!globalThis.SolidDevtools$$) {
    throw new Error(
        `[devtools]: Debugger hasn't found the exposed Solid Devtools API. Did you import the setup script?`,
    )
}

const setup = globalThis.SolidDevtools$$

export default setup
