import '@devtoolsoverlay/debugger/setup'

import {
    setClientVersion,
    setSolidVersion,
} from '@devtoolsoverlay/debugger/setup'

setClientVersion(process.env.CLIENT_VERSION)
setSolidVersion(process.env.SOLID_VERSION, process.env.EXPECTED_SOLID_VERSION)

export {
    setLocatorOptions,
    setElementInterface,
} from '@devtoolsoverlay/debugger/setup'
