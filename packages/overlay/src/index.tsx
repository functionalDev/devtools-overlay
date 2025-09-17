import * as s from 'solid-js'
import * as web from 'solid-js/web'
import {createBodyCursor} from '@solid-primitives/cursor'
import {makeEventListener} from '@solid-primitives/event-listener'
import * as num from '@nothing-but/utils/num'
import {Icon, MountIcons, Devtools} from '@devtools/frontend'

import frontendStyles from '@devtools/frontend/dist/index.css?inline'
import overlayStyles from './styles.css?inline'
import { makePersisted } from '@solid-primitives/storage'
import type { Module } from '../../frontend/src/ModuleFactory/ModuleFactory'
import { exampleModules } from '../../frontend/src/ModuleFactory/exampleModules'


export type OverlayOptions = {
    defaultOpen?: boolean
    alwaysOpen?:  boolean
    noPadding?:   boolean
    modules: Module[]
}

const defaultOptions = {
    modules: exampleModules,
}

const [ isOpen, setIsOpen ] = makePersisted(s.createSignal(), {
    name: 'devtools-overlay-open',
    storage: sessionStorage,
})


export function attachDevtoolsOverlay(props: OverlayOptions): (() => void) {

    /*
     Only load the overlay after the page is loaded
    */
    let [show, setShow] = s.createSignal(false)
    setTimeout(() => {
        setShow(() => true)
    })
    const modules = [ ...defaultOptions.modules, ...props.modules];

    return s.createRoot(dispose => {
        s.createEffect(() => {
            if (show()) {
                <Overlay {...props} modules={modules} />
            }
        })
        return dispose
    })
}

const Overlay: s.Component<OverlayOptions> = props => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if(!window) return;

    let {alwaysOpen, defaultOpen, noPadding} = props

    // const instance = useDebugger()

    // if (defaultOpen || alwaysOpen) {
    //     instance.toggleEnabled(true)
    // }
    if(isOpen() === null && defaultOpen) {
        setIsOpen(true);
    }

    function toggleOpen() {
        if (!alwaysOpen) {
           setIsOpen(s => !s)
        }
    }

    const [progress, setProgress] = makePersisted(s.createSignal(0.5), {
        name: 'devtools-overlay-height',
        storage: localStorage,

    });

    const [dragging, setDragging] = s.createSignal(false)

    makeEventListener(window, 'pointermove', e => {
        if (!dragging()) return
        const vh = window.innerHeight
        setProgress(1 - num.clamp(e.y, 0, vh - 200) / vh)
    })
    makeEventListener(window, 'pointerup', () => setDragging(false))

    createBodyCursor(() => dragging() && 'row-resize')

    let ref;
    

    return (
        <web.Portal mount={document.body}>
            <div
                data-darkreader-ignore
                class="overlay__container"
                classList={{'no-padding': noPadding}}
                data-open={isOpen()}
                style={{
                    '--progress': isOpen() ? progress(): -10,
                    display: 'contents',
                }}
                data-testid="devtools-overlay"
                ref={ref}
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
                        <div
                            class="overlay__container__resizer"
                            onPointerDown={e => {
                                e.preventDefault()
                                setDragging(true)
                            }}
                        />
                    <div class="overlay__container__inner">
                        <Devtools modules={props.modules} />
                    </div>
                </div>
            </div>
            <style>{frontendStyles.replaceAll(/(\d)rem/g, '$1em')}</style>
            <style>{overlayStyles.replaceAll(/(\d)rem/g, '$1em')}</style>
        </web.Portal>
    )
}

