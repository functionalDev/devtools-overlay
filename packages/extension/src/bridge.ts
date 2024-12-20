/*

File for utilities, constants and types related to the communication between the different parts of the extension.

*/

import * as debug from '@solid-devtools/debugger/types'

export const DEVTOOLS_ID_PREFIX = '[solid-devtools]_'

export const enum Place_Name {
    Content             = 'Content_Script',
    Devtools            = 'Devtools_Script',
    Popup               = 'Popup',
    Panel               = 'Panel',
    Background          = 'Background',
    Debugger_Real_World = 'Debugger_Real_World',
    Detector_Real_World = 'Detector_Real_World',
}

export const enum ConnectionName {
    Content  = DEVTOOLS_ID_PREFIX+Place_Name.Content,
    Devtools = DEVTOOLS_ID_PREFIX+Place_Name.Devtools,
    Popup    = DEVTOOLS_ID_PREFIX+Place_Name.Popup,
    Panel    = DEVTOOLS_ID_PREFIX+Place_Name.Panel,
}

export type DetectionState = {
    Solid:    boolean
    SolidDev: boolean
    Debugger: boolean
}

export type Versions = {
    client: string | null
    solid: string | null
    expectedClient: string
    extension: string
}

export interface GeneralChannels {
    // client -> content -> devtools.html
    Detected: DetectionState | null

    // the `string` payload is the main version
    Debugger_Connected: {
        solid:  string | null
        client: string | null
    }
    Versions: Versions | null

    /** devtools -> client: the chrome devtools got opened or entirely closed */
    DevtoolsOpened: boolean

    ResetPanel: void
}

export type Channels = debug.Debugger.InputChannels
              & debug.Debugger.OutputChannels
              & GeneralChannels

export type Message = {
    [K in keyof Channels]: {
        name:    K,
        details: Channels[K],
    }
}[keyof Channels]

export function to_message(e: any): Message | null {
    return e && typeof e === 'object' && typeof e['name'] === 'string'
        ? e
        : null
}

export type Port = chrome.runtime.Port

export function port_on_message(port: Port, cb: (e: Message) => void) {
    port.onMessage.addListener(_e => {
        let e = to_message(_e)
        if (e) cb(e)
    })
}

export function port_post_message<K extends keyof Channels>(
    port: Port, name: K, details: Channels[K],
) {
    port.postMessage({name, details})
}
export function port_post_message_obj(port: Port, e: Message) {
    port.postMessage(e)
}

export function window_on_message(cb: (e: Message) => void) {
    window.addEventListener('message', e => {
        let msg = to_message(e.data)
        if (msg) cb(msg)
    })
}

export function window_post_message<K extends keyof Channels>(
    name: K, details: Channels[K],
) {
    postMessage({name, details})
}
export function window_post_message_obj(e: Message) {
    postMessage(e)
}
