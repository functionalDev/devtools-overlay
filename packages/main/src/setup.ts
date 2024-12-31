import '@solid-devtools/debugger/setup'

import {
    setClientVersion,
    setOwnerLocation,
    setSolidVersion,
    setLocatorOptions,
} from '@solid-devtools/debugger/setup'

setClientVersion(process.env.CLIENT_VERSION)
setSolidVersion(process.env.SOLID_VERSION, process.env.EXPECTED_SOLID_VERSION)

/**
 * Set debugger locator module options.
 * Used by the `solid-devtools` plugin.
 */
export function setComponentLocation(location: string): void {
    if (typeof location !== 'string') return
    setOwnerLocation(location)
}

export {setLocatorOptions}
