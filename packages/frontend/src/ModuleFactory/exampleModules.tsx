import { GraphqlDataModule } from "./GraphqlDataModule.tsx";
import { ModesModule } from "./ModesModule.tsx";
import { type Module } from "./ModuleFactory.tsx";
import { TrackingModule } from "./TrackingModule.tsx";


export const exampleModules: Module[] = [
    ModesModule(),
    TrackingModule(),
    GraphqlDataModule(),
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
        title: 'Recommendations',
    },
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
        title: 'CrUX',
    },
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
        title: 'CVW',
    },
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
    },
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
        title: 'CoCo',
    },
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
    },
]