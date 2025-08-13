/** @refresh reload */

import * as s from 'solid-js'
import {render} from 'solid-js/web'

import {
    Connection_Name, Place_Name, port_on_message,
    place_log,
    type Detection_State, type Versions,
} from './shared.ts'

import './popup.css'

place_log(Place_Name.Popup, 'loaded.')

// Create a connection to the background page
const port = chrome.runtime.connect({name: Connection_Name.Popup})

const [versions, setVersions] = s.createSignal<Versions | null>(null)
const empty_detection_state: Detection_State = {
    solid:    false,
    solid_dev: false,
    setup: false,
}
const [detectionState, setDetectionState] = s.createSignal(empty_detection_state)

type Connection_Status = {
    [Place_Name.Content]:  boolean
    [Place_Name.Devtools]: boolean
    [Place_Name.Panel]:    boolean
}
const empty_connection_status: Connection_Status = {
    [Place_Name.Content]:  false,
    [Place_Name.Devtools]: false,
    [Place_Name.Panel]:    false,
}
const [connectionStatus, setConnectionStatus] = s.createSignal(empty_connection_status)

port_on_message(port, e => {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (e.kind) {
    case 'Detected':
        setDetectionState(e.data ?? empty_detection_state)
        break
    case 'Versions':
        setVersions(e.data)
        break
    case 'Port_Connection_Status':
        setConnectionStatus(prev => ({
            ...prev,
            [e.data.place]: e.data.state
        }))
        break
    }
})

function not_str(value: boolean): string {
    return value ? '' : 'not'
}

const App: s.Component = () => {
    return <>
        <div>
            <p data-status={detectionState().solid}>
                Solid {not_str(detectionState().solid)} detected
            </p>
        </div>
        <div>
            <p data-status={detectionState().solid_dev}>
                Solid Dev Mode {not_str(detectionState().solid_dev)} detected
            </p>
        </div>
        <div>
            <p data-status={detectionState().setup}>
                Debugger {not_str(detectionState().setup)} detected
            </p>
            <s.Show when={detectionState().solid_dev && !detectionState().setup}>
                <div class="details">
                    <p>
                        Devtools extension requires a runtime client to be installed.
                        <br />
                        Please follow the{' '}
                        <a
                            href="https://github.com/thetarnav/devtools/tree/main/extension#getting-started"
                            target="_blank"
                        >
                            installation instructions
                        </a>
                        .
                    </p>
                </div>
            </s.Show>
        </div>
        <div>
            <p data-status={connectionStatus()[Place_Name.Content]}>
                Content Script {not_str(connectionStatus()[Place_Name.Content])} connected
            </p>
        </div>
        <div>
            <p data-status={connectionStatus()[Place_Name.Devtools]}>
                Devtools {not_str(connectionStatus()[Place_Name.Devtools])} connected
            </p>
        </div>
        <div>
            <p data-status={connectionStatus()[Place_Name.Panel]}>
                Panel {not_str(connectionStatus()[Place_Name.Panel])} connected
            </p>
        </div>
        <s.Show when={versions()} keyed>
        {v => (
            <div class="versions">
                <p>Versions:</p>
                <ul>
                    <li>Solid ___________ {v.solid || 'unknown'}</li>
                    <li>Extension _______ {v.extension}</li>
                    <li>Client found ____ {v.client || 'unknown'}</li>
                    <li>Client expected _ {v.client_expected}</li>
                </ul>
            </div>
        )}
        </s.Show>
        <div class="external-links">
            <a
                href="https://github.com/thetarnav/solid-devtools/issues"
                target="_blank"
                class="issue-link"
            >
                <Icon_Bug />
                Report an Issue
            </a>
            <a
                href="https://github.com/sponsors/thetarnav"
                target="_blank"
                class="support-link"
            >
                <Icon_Heart />
                Support the Project
            </a>
        </div>
    </>
}

function Icon_Heart() {
    return <svg
        class="icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        fill="none">
        <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"
        />
    </svg>
}

function Icon_Bug() {
    return <svg
        class="icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        fill="none">
        <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
            d="M144,92a12,12,0,1,1,12,12A12,12,0,0,1,144,92ZM100,80a12,12,0,1,0,12,12A12,12,0,0,0,100,80Zm116,64A87.76,87.76,0,0,1,213,167l22.24,9.72A8,8,0,0,1,232,192a7.89,7.89,0,0,1-3.2-.67L207.38,182a88,88,0,0,1-158.76,0L27.2,191.33A7.89,7.89,0,0,1,24,192a8,8,0,0,1-3.2-15.33L43,167A87.76,87.76,0,0,1,40,144v-8H16a8,8,0,0,1,0-16H40v-8a87.76,87.76,0,0,1,3-23L20.8,79.33a8,8,0,1,1,6.4-14.66L48.62,74a88,88,0,0,1,158.76,0l21.42-9.36a8,8,0,0,1,6.4,14.66L213,89.05a87.76,87.76,0,0,1,3,23v8h24a8,8,0,0,1,0,16H216ZM56,120H200v-8a72,72,0,0,0-144,0Zm64,95.54V136H56v8A72.08,72.08,0,0,0,120,215.54ZM200,144v-8H136v79.54A72.08,72.08,0,0,0,200,144Z"
        />
    </svg>
}

render(() => <App />, document.getElementById('root')!)
