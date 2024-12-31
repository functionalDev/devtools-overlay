import '@solid-devtools/debugger/setup'

import * as s from 'solid-js'
import * as web from 'solid-js/web'
import {createBodyCursor} from '@solid-primitives/cursor'
import {makeEventListener} from '@solid-primitives/event-listener'
import * as num from '@nothing-but/utils/num'
import {useDebugger} from '@solid-devtools/debugger/bundled'
import {Icon, MountIcons, createDevtools} from '@solid-devtools/frontend'
import {useIsMobile, useIsTouch, atom} from '@solid-devtools/shared/primitives'

import frontendStyles from '@solid-devtools/frontend/dist/styles.css'
import overlayStyles from './styles.css'

export type OverlayOptions = {
    defaultOpen?: boolean
    alwaysOpen?:  boolean
    noPadding?:   boolean
}

export function attachDevtoolsOverlay(props?: OverlayOptions): (() => void) {

    /*
     Only load the overlay after the page is loaded
    */
    let show = atom(false)
    setTimeout(() => {
        show.set(true)
    })

    return s.createRoot(dispose => {
        s.createEffect(() => {
            if (show()) {
                <Overlay {...props} />
            }
        })
        return dispose
    })
}

const Overlay: s.Component<OverlayOptions> = ({defaultOpen, alwaysOpen, noPadding}) => {

    const debug = useDebugger()

    if (defaultOpen || alwaysOpen) {
        debug.toggleEnabled(true)
    }

    const isOpen = atom(alwaysOpen || debug.enabled())
    function toggleOpen(enabled?: boolean) {
        if (!alwaysOpen) {
            enabled ??= !isOpen()
            debug.toggleEnabled(enabled)
            isOpen.set(enabled)
        }
    }

    const isMobile = useIsMobile()
    const isTouch  = useIsTouch()

    const progress = s.createMemo(
        () => atom(isMobile() ? 0.8 : 0.5)
    )
    const dragging = atom(false)

    makeEventListener(window, 'pointermove', e => {
        if (!dragging()) return
        const vh = window.innerHeight
        progress().set(1 - num.clamp(e.y, 0, vh - 300) / vh)
    })
    makeEventListener(window, 'pointerup', () => dragging.set(false))

    createBodyCursor(() => dragging() && 'row-resize')

    return (
        <web.Portal useShadow mount={document.documentElement}>
            <div
                data-darkreader-ignore
                class="overlay__container"
                classList={{'no-padding': noPadding}}
                data-open={isOpen()}
                style={{'--progress': progress()()}}
                data-testid="solid-devtools-overlay"
            >
                <div class="overlay__container__fixed">
                    {!alwaysOpen && (
                        <button class="overlay__toggle-button" onClick={() => toggleOpen()}>
                            Devtools
                            <web.Dynamic
                                component={isOpen() ? Icon.EyeSlash : Icon.Eye}
                                class="overlay__toggle-button__icon"
                            />
                        </button>
                    )}
                    <s.Show when={!isTouch()}>
                        <div
                            class="overlay__container__resizer"
                            onPointerDown={e => {
                                e.preventDefault()
                                dragging.set(true)
                            }}
                        />
                    </s.Show>
                    <div class="overlay__container__inner">
                        <s.Show when={isOpen()}>
                        {_ => {
                            
                            debug.emit('ResetState')
                        
                            s.onCleanup(() => debug.emit('InspectNode', null))
                        
                            const devtools = createDevtools({
                                headerSubtitle: () => 'overlay',
                            })
                        
                            devtools.output.listen(e => {
                                separate(e.details, details => debug.emit(e.name, details as never))
                            })
                        
                            debug.listen(e => {
                                separate(e, devtools.input.emit)
                            })
                        
                            return <devtools.Devtools />
                        }}
                        </s.Show>
                    </div>
                </div>
            </div>
            <MountIcons />
            <style>{frontendStyles}</style>
            <style>{overlayStyles}</style>
        </web.Portal>
    )
}



function clone<T>(data: T): T {
    return typeof data === 'object' ? (JSON.parse(JSON.stringify(data)) as T) : data
}
function separate<T>(data: T, callback: (value: T) => void): void {
    queueMicrotask(() => {
        const v = clone(data)
        queueMicrotask(() => callback(v))
    })
}
