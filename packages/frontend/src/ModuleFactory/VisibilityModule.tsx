import { Portal, render } from "solid-js/web";
import type { ModuleFactory } from "./ModuleFactory.tsx";
import { VisibilityIcon } from "../icons/VisibilityIcon.jsx";
import { createSignal, Show } from "solid-js";
import { Switch } from "../ui/Switch.tsx";
import { getCurrentModule } from "../UIContext.tsx";


const markCbs = () => {
    const cbs = document.querySelectorAll('[id][data-tracking-name^="section-"]');
    cbs.forEach((cb) => {
        // @ts-ignore
        cb.style.background = cb.getAttribute('data-tracking-viewed') ? 'lightgreen': ''
    });
}

export const VisibilityModule: ModuleFactory = () => {
    let handle: number;
    return {
        MainView: () => {
            const [areBoundriesVisible, setBoundriesVisible] = createSignal(true);
            const [hightlightCB, setHighlightCB] = createSignal(true);
            const [rootMarginTop, setRootMarginTop] = createSignal(25);
            const [rootMarginBottom, setRootMarginBottom] = createSignal(30);

            handle && clearInterval(handle);
            handle = setInterval(markCbs, 300);

            return (
                <div style={{
                padding: '20px', display: 'grid', gap: '20px', 'justify-items': 'start', 'grid-template-columns': 'max-content min-content min-content min-content',
                }}>
                <h3 style={{
                    'grid-column': '1/-1',
                }}>Test visibility tracking</h3>

                <Switch class="col-span-full"
                checked={areBoundriesVisible()} onChange={() => setBoundriesVisible(s => !s)}>
                    Hide boundries
                </Switch>
                <Switch class="col-span-full"
                checked={hightlightCB()} onChange={() => setHighlightCB(s => !s)}>
                    Hightlight Lane
                </Switch>
                <label html-for="devtools-rootmargin-top">Boundry top</label>
                <input id="devtools-rootmargin-top" type="range" value={rootMarginTop()} min="0" max="49" onChange={e => setRootMarginTop(+e.target.value)}/>
                <input value={rootMarginTop()} onChange={e => setRootMarginTop(+e.target.value)}>{rootMarginTop()}</input>%

                <label html-for="devtools-rootmargin-bottom">Boundry bottom</label>
                <input id="devtools-rootmargin-bottom" type="range" value={rootMarginBottom()} min="0" max="49" onChange={e => setRootMarginBottom(+e.target.value)}/>
                <input value={rootMarginBottom()} onChange={e => setRootMarginBottom(+e.target.value)}>{rootMarginBottom()}</input>%
                <Portal mount={document.body}>
                    <Show when={getCurrentModule()?.title ==='Visibility' }>
                        <div 
                            id="devtools-vis-top"
                            style={{
                                'z-index': 9999999,
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: `${rootMarginTop()}%`,
                                background: 'rgba(255,0,0,0.3)',
                                transition: 'height 50ms',
                                'pointer-events': 'none',
                        }}/>
                    </Show>
                </Portal>
                <Portal mount={document.body}>
                    <Show when={getCurrentModule()?.title ==='Visibility'}>

                        <div 
                            id="devtools-vis-top"
                            style={{
                            'z-index': 9999999,
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: `${rootMarginBottom()}%`,
                            background: 'rgba(255,0,0,0.3)',
                            transition: 'height 50ms',
                            'pointer-events': 'none',
                        }}/>
                    </Show>
                </Portal>
                </div>
        )},
        title: 'Visibility 1231231',
        Icon: <VisibilityIcon/>,
        render
}
}