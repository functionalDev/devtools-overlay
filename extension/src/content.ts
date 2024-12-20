/*

Constent Script

This script is injected into every page and is responsible for:

- Forwarding messages between the background script and the debugger
- Injecting the real-world script to detect if solid is on the page (and the debugger if so)

*/

import {error, log} from '@solid-devtools/shared/utils'

import {
    Place_Name, ConnectionName,
    port_on_message, port_post_message_obj, port_post_message,
    window_post_message_obj, window_on_message, window_post_message,
} from './shared.ts'

// @ts-expect-error ?script&module query ensures output in ES module format and only import the script path
import real_world_path from './real_world.ts?script&module'


DEV: {log(Place_Name.Content+' loaded.')}


function loadScriptInRealWorld(path: string): Promise<void> {
    return new Promise((resolve, reject) => {

        const script = document.createElement('script')
        script.src  = chrome.runtime.getURL(path)
        script.type = 'module'

        script.addEventListener('error', err => reject(err))
        script.addEventListener('load', () => resolve())

        /* The script should execute as soon as possible */
        const mount = (document.head as HTMLHeadElement | null) || document.documentElement
        mount.appendChild(script)
    })
}


/* Wait for the document to fully load before injecting any scripts */
if (document.readyState === 'complete') {
    on_loaded()
} else {
    document.addEventListener('DOMContentLoaded', () => {
        on_loaded()
    })
}

function on_loaded() {

    /*
    Load Real_World script
    ↳ Debugger_Setup detected
        ↳ Load Debugger
            ↳ 'Debugger_Connected' message
    */

    loadScriptInRealWorld(real_world_path)
        .catch(err => error(`Real_World script (${real_world_path}) failed to load.`, err))
}


const extension_version = chrome.runtime.getManifest().version

const port = chrome.runtime.connect({name: ConnectionName.Content})

let devtools_opened = false

/* From Background */
port_on_message(port, e => {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (e.name) {
    case 'DevtoolsOpened':
        devtools_opened = e.details
        window_post_message_obj(e)
        break
    default:
        /* Background -> Client */
        window_post_message_obj(e)
    }
})

/* From Client / Detector_Real_World */
window_on_message(e => {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (e.name) {
    case 'Debugger_Connected': {

        // eslint-disable-next-line no-console
        console.log(
            '🚧 %csolid-devtools%c is in early development! 🚧\nPlease report any bugs to https://github.com/thetarnav/solid-devtools/issues',
            'color: #fff; background: rgba(181, 111, 22, 0.7); padding: 1px 4px;',
            'color: #e38b1b',
        )

        port_post_message(port, 'Versions', {
            client:         e.details.client,
            solid:          e.details.solid,
            extension:      extension_version,
            client_expected: import.meta.env.EXPECTED_CLIENT,
        })

        if (devtools_opened) {
            window_post_message('DevtoolsOpened', devtools_opened)
        }

        break
    }
    default:
        /* Client -> Background */
        port_post_message_obj(port, e)
    }
})

