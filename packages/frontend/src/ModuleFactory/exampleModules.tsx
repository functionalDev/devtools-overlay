import { render } from "solid-js/web";
import { GraphqlDataModule } from "./GraphqlDataModule.tsx";
import { ModesModule } from "./ModesModule.tsx";
import { type Module } from "./ModuleFactory.tsx";
import { TrackingModule } from "./TrackingModule.tsx";


export const exampleModules: Module[] = [
    ModesModule(),
    TrackingModule(),
    GraphqlDataModule(),
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
    {
        connector: {
            initFn: () => ({
                'some context': 'value',
            })
        },
        MainView: ({ openSidePanel }) => (
        <div>test22
            <button onClick={() => openSidePanel((b) => !b)}>
                toggleSidepanel33
            </button>
        </div>
        ),
        SidePanel: () => <div>side22</div>,
        title: 'GraphQL',
        render,
    },
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
    {
        connector: {
            initFn: () => ({
                'some context': 'value',
            })
        },
        MainView: ({ openSidePanel }) => (
        <div>test22
            www.peach.com
            <button onClick={() => openSidePanel((b) => !b)}>
                toggleSidepanel33
            </button>
        </div>
        ),
        SidePanel: () => <div>side22</div>,
        title: 'PEACH links',
        render,
    },
]