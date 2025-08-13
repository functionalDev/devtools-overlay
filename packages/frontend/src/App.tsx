import * as s from 'solid-js'
import * as theme from '@devtools/shared/theme'
import * as ui from './ui/index.ts'
import {createSidePanel} from './SidePanel.tsx'
import type { Module } from './ModuleFactory/ModuleFactory.tsx'
import { MainView } from './MainView/MainView.tsx'
import { UIContextProvider, useUIContext } from './UIContext.tsx'
import { StyledEngineProvider } from '@suid/material'

const getMuiStyles = (): NodeListOf<HTMLStyleElement> => document.querySelectorAll('style[id][data-uses]');
const updateCopyForMuiStyles = (styleEl: HTMLStyleElement) => {
    let copyEl = document.getElementById(`${styleEl.id}-copy`);
    if(!copyEl){
        copyEl = document.createElement('style');
        copyEl.id = `${styleEl.id}-copy`;
        const styleContainer = document.getElementById("mui-style-copy-container");
        styleContainer?.append(copyEl);
    }
    // since we adjust font-size to 10px on the page we need to change all "rem" to "em" otherwise everything is small
    const normalizedStyles = styleEl.textContent?.replaceAll(/(\d)rem/g, '$1em')
    copyEl.textContent = normalizedStyles || null;
}

const copyAllMuiStyles = () => {
    const callback: MutationCallback = () => {
        getMuiStyles().forEach(updateCopyForMuiStyles)
    };
    const observer = new MutationObserver(callback);
    
    const config = { attributes: true, childList: true, subtree: true };
    
    const targetNode = document.head;
    observer.observe(targetNode, config);
    
    getMuiStyles().forEach(updateCopyForMuiStyles)
}




export const App: s.Component<{
    headerSubtitle?: s.JSX.Element,
    modules: Module[],
}> = props => {
    // side panel is created here to keep the state between renders
    const sidePanel = createSidePanel()
    copyAllMuiStyles();

    return (
        <div
            class="h-full w-full overflow-hidden grid text-base font-sans bg-panel-bg text-text"
            style={{'grid-template-rows': `min-content min-content 1fr`}}
        >
            <div style={{ display: 'none'}} id="mui-style-copy-container"></div>
            <header
                class="p-2 flex items-center gap-x-2 bg-panel-bg b-b text-text"
            >
                <div class="flex items-center gap-x-2">
                    {/* <ui.icon.SolidWhite class="w-4 h-4 text-disabled" /> */}
                    <div>
                        <h3 style={{ 'font-size': '1em', 'margin-bottom': '0' }}>NEST Developer Tools</h3>
                        {/* {props.headerSubtitle && (
                            <p class="text-disabled font-mono text-sm">{props.headerSubtitle}</p>
                        )} */}
                    </div>
                </div>
                {/* <MainViewTabs /> */}
                <Options />
            </header>
            <div class="overflow-hidden">
                <StyledEngineProvider>

                <UIContextProvider modules={props.modules}>
                    <ui.SplitterRoot>
                        <ui.SplitterPanel>
                            <MainView />
                        </ui.SplitterPanel>
                        <s.Show when={useUIContext().getCurrentModule()?.SidePanel && useUIContext().isSidePanelOpen()}>
                            <ui.SplitterPanel>
                                <sidePanel.SidePanel/>
                            </ui.SplitterPanel>
                        </s.Show>
                    </ui.SplitterRoot>
                </UIContextProvider>
                </StyledEngineProvider>
            </div>
        </div>
    )
}

const Options: s.Component = () => {

    let details!: HTMLDetailsElement

    return (
        <details
            ref={details}
            class="relative ml-auto"
            on:focusout={e => {
                // Close if focus moves outside the details element
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    details.removeAttribute('open')
                }
            }}
            on:keydown={e => {
                switch (e.key) {
                case 'Escape':
                    details.removeAttribute('open')
                    break
                case 'ArrowDown':
                case 'ArrowUp': {
                    e.preventDefault()
                    let root = details.getRootNode()
                    if (root instanceof Document || root instanceof ShadowRoot) {
                        let items = [...details.querySelectorAll('[role="menuitem"]')]
                        let focused_idx = items.indexOf(root.activeElement!)
                        let dir = e.key === 'ArrowDown' ? 1 : -1
                        let next_idx = (focused_idx + dir + items.length) % items.length
                        let el = items[next_idx]
                        if (el instanceof HTMLElement) el.focus()
                    }
                    break
                }
                }
            }}>
            <summary
                class={`${ui.toggle_button} rounded-md ml-auto w-7 h-7`}>
                <ui.icon.Options
                    class="w-4.5 h-4.5"
                />
            </summary>
            <div
                class='absolute z-9999 w-max top-0 right-full mr-2 p-1 rounded-md bg-panel-2 b b-solid b-panel-3'>
                <div
                    role='menu'
                    class='flex flex-col items-stretch gap-0.5'>
                    <button
                        role='menuitem'
                        tabindex='0'
                        class='
                            flex items-center gap-1 p-1 rounded-md outline-none
                            text-text transition-colors hover:bg-orange-500/10 focus:bg-orange-500/10'>
                        <ui.icon.Bug class='w-3 h-3 mb-px text-orange-500 dark:text-orange-400' />
                        Report a bug
                    </button>
                    <button
                        role='menuitem'
                        tabindex='0'
                        class='
                            flex items-center gap-1 p-1 rounded-md outline-none
                            text-text transition-colors hover:bg-pink-500/10 focus:bg-pink-500/10'>
                        <ui.icon.Heart class='w-3 h-3 mb-px text-pink-500 dark:text-pink-400' />
                        Support the project
                    </button>
                </div>
            </div>
        </details>
    )
}
