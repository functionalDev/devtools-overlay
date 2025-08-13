import { type Accessor, type JSXElement, type Setter } from "solid-js"

export type ModuleConnector<ModuleContext> = {
    initFn: () => ModuleContext
}

export type MainViewProps = {
    isSidePanelOpen: Accessor<boolean>,
    openSidePanel: Setter<boolean>,
}

export type SidePanelProps = {

}

export type Module<ModuleContext = object> = {
    title: string,
    connector?: ModuleConnector<ModuleContext>,
    MainView: (props: MainViewProps) => JSXElement,
    SidePanel?: (props: SidePanelProps) => JSXElement,
    // render: (element: HTMLElement) => any,
}

export type ModuleFactory<T = object> = () => Module<T>

export const createModule = (moduleFactory: ModuleFactory): Module => {
    return moduleFactory();
}


