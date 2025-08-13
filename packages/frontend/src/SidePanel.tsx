import clsx from 'clsx'
import * as s from 'solid-js'
import * as theme from '@devtools/shared/theme'
import type { Module } from './ModuleFactory/ModuleFactory.tsx'
import { useUIContext } from './UIContext.tsx'
import { Close } from "@suid/icons-material";

export const panel_header_el_border =
    'content-empty absolute z-1 inset-x-0 top-full h-0.6px bg-panel-border'


// TODO these should probably be abstracted to a reusable component

export const hover_background = `bg-gray-5 dark:bg-gray-4
    bg-opacity-0 dark:bg-opacity-0
    hover:bg-opacity-10 selected:hover:bg-opacity-10
    active:bg-opacity-05 active:hover:bg-opacity-05 selected:bg-opacity-05
    transition-colors`

export const hover_text = `text-gray-5 dark:text-gray-4
    text-opacity-85 dark:text-opacity-85
    hover:text-opacity-100 selected:text-opacity-100`

export const action_button = clsx(hover_background, hover_text, 'w-6 h-6 rounded center-child')

export const action_icon = 'w-4 h-4'

export function createSidePanel() {
    const SidePanel: s.Component = props => {
        const {openSidePanel, getCurrentModule} = useUIContext()
        const SidePanelView = getCurrentModule()?.SidePanel
        return (
                <div
                    class="h-full grid"
                    style={{
                        'grid-template-rows': `${theme.spacing.header_height} 1fr`,
                        'grid-template-columns': '100%',
                    }}
                >
                    <header class="relative p-l-4 flex items-center">
                        <div class={panel_header_el_border} />
                        <div class="flex items-center gap-x-2">
                        </div>
                        <div class="p-x-1 ml-auto flex items-center gap-x-1">
                            <button
                                title="Close inspector"
                                class={action_button}
                                onClick={() => openSidePanel(false)}
                            >
                                <Close/>
                            </button>
                        </div>
                    </header>
                    {/* 
                    // @ts-ignore */}
                    <SidePanelView/>
                </div>
        )
    }

    return {
        SidePanel,
    }
}
