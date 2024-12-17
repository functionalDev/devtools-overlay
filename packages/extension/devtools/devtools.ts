/*

The devtools script is run every time the devtools are opened.
And it creates a brand new panel every time.

It connects to the background script.

*/

import {error, log} from '@solid-devtools/shared/utils'
import * as bridge from '../shared/bridge.ts'
import * as icons from '../shared/icons.ts'

log(bridge.Place_Name.Devtools_Script+' loaded.')

// Create a connection to the background page
const port = chrome.runtime.connect({name: bridge.ConnectionName.Devtools})

const {onPortMessage: fromBackground} = bridge.createPortMessanger(
    bridge.Place_Name.Devtools_Script,
    bridge.Place_Name.Background,
    port)

// Firefox requires absolute path
const PATH_PREFIX = import.meta.env.BROWSER === 'firefox' ? '/' : ''

// "Versions" mean that devtools client is on the page
bridge.once(fromBackground, 'Versions', () => {

    log('Debugger connected -> Creating Devtools_Panel...')

    chrome.devtools.panels.create(
        'Solid',
        PATH_PREFIX + icons.OUTLINE_32,
        PATH_PREFIX + 'index.html',
        () => {
            if (chrome.runtime.lastError) {
                error('Creating Devtools_Panel Failed', chrome.runtime.lastError)
            } else {
                log('Devtools_Panel created.')
            }
        },
    )
})
