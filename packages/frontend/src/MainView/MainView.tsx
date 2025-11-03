
import { createEffect, createSignal } from "solid-js";
import { getCurrentModule } from "../UIContext.tsx";
import type { MainViewProps } from "../ModuleFactory/ModuleFactory.tsx";

export const MainView = (props: MainViewProps) => {
    const [ refMainView, setRefMainView ] = createSignal<HTMLDivElement | null>(null)
    createEffect(() => {
        const module = getCurrentModule();
        const ref = refMainView();
        if(ref !== null && module !== undefined) {
            ref.replaceChildren();
            module.render(() => module.MainView(props), ref)
        }
    })
    return (
        <div style={{ 'display': 'grid', height: '100%'}}>
            <div ref={setRefMainView} style={{ 'overflow-y': 'auto', height: '100%' }} id="devtools-overlay-mainview"></div>
        </div>
)}