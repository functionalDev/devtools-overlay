import { type Component } from 'solid-js'
import {App} from './App.tsx'
import * as ui from './ui/index.ts'
import type { Module } from './ModuleFactory/ModuleFactory.tsx'
import { initModules } from './UIContext.tsx'


export const Devtools: Component<{ modules: Module[] }> = (props) => {
    initModules(props.modules);
    return (
        <div class={ui.devtools_root_class + ' h-inherit'}>
            <ui.Styles />
            <App/>
        </div>
    )
}
