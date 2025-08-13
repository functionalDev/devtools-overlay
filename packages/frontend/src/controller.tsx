import * as s from 'solid-js'
import * as debug from '@devtools/debugger/types'
import {App} from './App.tsx'
import * as ui from './ui/index.ts'
import { exampleModules } from './ModuleFactory/exampleModules.tsx'


export type InputMessage   = debug.OutputMessage
export type InputListener  = debug.OutputListener
export type OutputMessage  = debug.InputMessage
export type OutputListener = debug.InputListener

export type InputEventBus = {
    emit:   (e: InputMessage) => void,
    listen: (fn: InputListener) => void,
}
export type OutputEventBus = {
    emit:   (e: OutputMessage) => void,
    listen: (fn: OutputListener) => void,
}


/**
 * devtools options provided to {@link Devtools} component
 * with their default values
 */
export type DevtoolsOptionsWithDefaults = {
    errorOverlayFooter: () => s.JSX.Element
    headerSubtitle:     () => s.JSX.Element
    useShortcuts:       boolean
    catchWindowErrors:  boolean
}

export type DevtoolsOptions = Partial<DevtoolsOptionsWithDefaults>

export function createDevtools(props: DevtoolsOptions) {
    return {
        Devtools() {
            return (
                <div class={ui.devtools_root_class + ' h-inherit'}>
                    <ui.Styles />
                    <App modules={exampleModules} headerSubtitle={props.headerSubtitle?.()} />
                </div>
            )
        },
    }
}
