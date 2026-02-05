import { render } from "solid-js/web";
// import { GraphqlDataModule } from "./GraphqlDataModule.tsx";
import { ModesModule } from "./ModesModule.tsx";
import { type Module, type ModuleFactory } from "./ModuleFactory.tsx";
import { TrackingModule } from "./TrackingModule.tsx";
import { VisibilityModule } from "./VisibilityModule.tsx";
import { CopyTemplateModule } from "./CopyTemplateModule/index.tsx";
import { CollaborativeFilteringModule } from "./CollaborativeFilteringModule.tsx";
import { createSignal } from "solid-js";

const ourModule: ModuleFactory = () => {
    const [counter, setCounter] = createSignal(0);
    return {
        title: 'my new fancy module',
        MainView: () => 
            <button onClick={() => setCounter(s => s + 1)}>{counter()}</button>,
        SidePanel: () => 'sidepanel',
        render,
    }
}

export const exampleModules: Module[] = [
    ModesModule(),
    TrackingModule(),
    VisibilityModule(),
    CollaborativeFilteringModule(),
    CopyTemplateModule(),
    ourModule(),
    // GraphqlDataModule(),
    // {
    //     connector: {
    //         initFn: () => ({
    //             'some context': 'value',
    //         })
    //     },
    //     MainView: ({ openSidePanel }) => (
    //     <div>test22
    //         <button onClick={() => openSidePanel((b) => !b)}>
    //             toggleSidepanel33
    //         </button>
    //     </div>
    //     ),
    //     SidePanel: () => <div>side22</div>,
    //     title: 'Recommendations',
    //     render,
    // },
    // {
    //     connector: {
    //         initFn: () => ({
    //             'some context': 'value',
    //         })
    //     },
    //     MainView: ({ openSidePanel }) => (
    //     <div>test22
    //         <button onClick={() => openSidePanel((b) => !b)}>
    //             toggleSidepanel33
    //         </button>
    //     </div>
    //     ),
    //     SidePanel: () => <div>side22</div>,
    //     title: 'CrUX',
    //     render,
    // },
    // {
    //     connector: {
    //         initFn: () => ({
    //             'some context': 'value',
    //         })
    //     },
    //     MainView: ({ openSidePanel }) => (
    //     <div>test22
    //         <button onClick={() => openSidePanel((b) => !b)}>
    //             toggleSidepanel33
    //         </button>
    //     </div>
    //     ),
    //     SidePanel: () => <div>side22</div>,
    //     title: 'CVW',
    //     render,
    // },
    // {
    //     connector: {
    //         initFn: () => ({
    //             'some context': 'value',
    //         })
    //     },
    //     MainView: ({ openSidePanel }) => (
    //     <div>test22
    //         <button onClick={() => openSidePanel((b) => !b)}>
    //             toggleSidepanel33
    //         </button>
    //     </div>
    //     ),
    //     SidePanel: () => <div>side22</div>,
    //     title: 'CoCo',
    //     render,
    // },
    // connector: {
    //     initFn: () => ({
    //         'some context': 'value',
    //     })
    // },
    // (() => {
    //     const [entryClicked, setEntryClicked] = createSignal(null);
    //     const onClickHandler = (e) => {
    //         const text = e.target.textContent;
    //         setEntryClicked(text);
    //     }
    //     return {
    //         MainView: ({ openSidePanel }) => (
    //             <ul>
    //                 <li onClick={(e) => onClickHandler(e) || openSidePanel(s => !s)}>most viewed</li>
    //                 <li onClick={onClickHandler}>least viewed</li>
    //                 <li onClick={onClickHandler}>decently viewed</li>
    //                 <li onClick={onClickHandler}>hardly viewed</li>
    //                 <li onClick={onClickHandler}>softly viewed</li>
    //                 <li onClick={onClickHandler}>accidentally</li>
    //             </ul>
    //         ),
    //         SidePanel: () => <div>{entryClicked()}</div>,
    //         title: 'PEACH links',
    //         render,
    //     } as Module
    // })(),
]
