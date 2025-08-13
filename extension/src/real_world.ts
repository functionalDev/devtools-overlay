/*

 A real-world script that will check if solid is on the page
 notify Content Script
 and create a debugger instance
 passing messages from and to the devtools frontend in Panel

 Debugger <-> Real_World <-> Content <-> Background <-> Panel <-> Frontend

*/

import * as detect from '@devtools/shared/detect'

import {
    Place_Name, type Detection_State,
    window_post_message, window_on_message, window_post_message_obj,
    place_log, place_warn,
} from './shared.ts'


DEV: {place_log(Place_Name.Detector_Real_World, 'loaded.')}

function main() {

    const detect_state: Detection_State = {
        solid:     false,
        solid_dev: false,
        setup:     false,
    }

    detect.detectSolid().then(detected => {
        if (import.meta.env.DEV) {
            if (detected) {
                place_log(Place_Name.Detector_Real_World, 'Solid detected.')
            } else {
                place_warn(Place_Name.Detector_Real_World, 'Solid NOT detected.')
            }
        }
        if (detected && !detect_state.solid) {
            detect_state.solid = true
            update_detected()
        }
    })

    detect.onSolidDevDetect(() => {
        if (import.meta.env.DEV) {
            place_log(Place_Name.Detector_Real_World, 'Solid_Dev_Mode detected.')
        }
        detect_state.solid_dev = true
        detect_state.solid     = true
        update_detected()
    })

    detect.onSolidDevtoolsDetect(() => {
        if (import.meta.env.DEV) {
            place_log(Place_Name.Detector_Real_World, 'Devtools_Client detected.')
        }
        detect_state.setup = true
        update_detected()
    })

    let debugger_attached = false
    function update_detected() {

        window_post_message('Detected', detect_state)

        if (!debugger_attached && detect_state.setup) {
            debugger_attached = true
            attach_debugger()
        }
    }
}


async function attach_debugger() {

    let debug = await import('@devtools/debugger')

    const instance = debug.useDebugger()

    /* Check versions */
    warn_on_version_mismatch(instance.versions.get_client(),
                             import.meta.env.EXPECTED_CLIENT,
                             'devtools')

    warn_on_version_mismatch(instance.versions.get_solid(),
                             instance.versions.get_expected_solid(),
                             'solid-js')

    // in case of navigation/page reload, reset the locator mode state in the extension
    window_post_message('ResetPanel', undefined)
    window_post_message('Debugger_Connected', {
        client: instance.versions.get_client(),
        solid:  instance.versions.get_solid(),
    })

    /* From Content */
    window_on_message(e => {
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (e.kind) {
        case 'DevtoolsOpened':
            instance.toggleEnabled(e.data)
            break
        default:
            /* Content -> Debugger */
            instance.emit(e as any)
        }
    })

    /* Debugger -> Content */
    instance.listen(window_post_message_obj)
}


class Version {
    major: number = 0
    minor: number = 0
    patch: number = 0
}

function version_from_string(str: string): [Version, boolean] {

    let v = new Version

    let parts = str.split('.')

    v.major = Number(parts[0])
    v.minor = Number(parts[1])
    v.patch = Number(parts[2])

    let ok = !isNaN(v.major) && v.major >= 0 &&
             !isNaN(v.minor) && v.minor >= 0 &&
             !isNaN(v.patch) && v.patch >= 0

    return [v, ok]
}

function match_version_patch(actual: Version, expected: Version): boolean {
    return actual.major === expected.major &&
           actual.minor === expected.minor &&
           actual.patch  >= expected.patch
}

function warn_on_version_mismatch(
    actual_str:   string | null,
    expected_str: string | null,
    title:        string,
) {
    if (!actual_str) {
        return place_warn(Place_Name.Detector_Real_World, `No actual ${title} version found!`)
    }
    if (!expected_str) {
        return place_warn(Place_Name.Detector_Real_World, `No expected ${title} version found!`)
    }

    // warn if the matching adapter version is not the same minor version range as the actual adapter
    let [actual,   actual_ok]   = version_from_string(actual_str)
    let [expected, expected_ok] = version_from_string(expected_str)

    if (!actual_ok) {
        place_warn(Place_Name.Detector_Real_World, `Actual version ${title}@${actual_str} cannot be parsed.`)
    }
    if (!expected_ok) {
        place_warn(Place_Name.Detector_Real_World, `Expected version ${title}@${expected_str} cannot be parsed.`)
    }
    if (!match_version_patch(actual, expected)) {
        place_warn(Place_Name.Detector_Real_World, `VERSION MISMATCH!
Current version:  ${title}@${actual_str}
Expected version: ${title}@${expected_str}`)
    }
}


main()
