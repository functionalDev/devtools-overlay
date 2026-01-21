import { type Accessor, type JSXElement, type Setter } from "solid-js"

export type ModuleConnector<ModuleContext> = {
    initFn: () => ModuleContext
}

export type MainViewProps = {
    isSidePanelOpen: Accessor<boolean | undefined>,
    openSidePanel: Setter<boolean>,
}

export type SidePanelProps = {
    colorScheme: 'light' | 'dark'
}

export type Module<ModuleContext = object> = {
    title: string,
    MainView: (props: MainViewProps & ModuleContext) => JSXElement,
    render: (component: any,element: HTMLElement) => any,
    SidePanel?: (props: SidePanelProps) => JSXElement,
    Icon?: string | JSXElement,
    connector?: ModuleConnector<ModuleContext>,
}

export type ModuleFactory<T = object> = () => Module<T>

export const createModule = (moduleFactory: ModuleFactory): Module => {
    return moduleFactory();
}


