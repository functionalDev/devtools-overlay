import { createContext, createSignal, useContext, type Accessor, type Component, type Setter } from "solid-js";
import { makePersisted } from '@solid-primitives/storage'
import type { Module } from "./ModuleFactory/ModuleFactory";

type UIContext = {
    isSidePanelOpen: Accessor<boolean>,
    openSidePanel: Setter<boolean>,
    getCurrentModule: ()  => Module | null
    setCurrentModule: (mod: Module)  => void
    getModules: ()  => Module[],
}

const [ getCurrentModuleName, setCurrentModuleName ] = makePersisted(createSignal<string>(''), {
    name: 'devtools-frontend-lastmodule',
    storage: sessionStorage,
});

const defaultContext: UIContext = {
    isSidePanelOpen: () => false,
    openSidePanel: () => false, 
    getCurrentModule: ()  => null,
    setCurrentModule: ()  => null,
    getModules: ()  => [],
}

const UIContext = createContext(defaultContext);

export const useUIContext = () => {
    return useContext(UIContext);
};

export const UIContextProvider: Component<{ children: any, modules: Module[] }> = (props) => {
    const [ isSidePanelOpen, openSidePanel ] = createSignal(false);
    
    // @ts-ignore
    const defaultModule: Module = props.modules[0];
    const getModuleByTitle = (title: string) => props.modules.find(m => m.title === title);
    const getCurrentModule = () => getModuleByTitle(getCurrentModuleName()) || defaultModule
    const setCurrentModule = (mod: Module) => setCurrentModuleName(mod.title)
    
    return (
        <UIContext.Provider value={{
            isSidePanelOpen,
            openSidePanel,
            getCurrentModule,
            setCurrentModule,
            getModules: () => props.modules,
        }}>
            {props.children}
        </UIContext.Provider>
    )
}