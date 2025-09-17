import { createSignal } from "solid-js";
import { makePersisted } from '@solid-primitives/storage'
import type { Module } from "./ModuleFactory/ModuleFactory";

const [ getCurrentModuleName, setCurrentModuleName ] = makePersisted(createSignal<string>(''), {
    name: 'devtools-frontend-lastmodule',
    storage: sessionStorage,
});

const [ _isSidePanelOpen, _openSidePanel ] = createSignal(false);
const [ _getModules, setModules ] = createSignal<Module[]>([]);


const getDefaultModule =  (): Module | undefined => getModules()[0];
const getModuleByTitle = (title: string) => getModules().find(m => m.title === title);

export const getCurrentModule = () => getModuleByTitle(getCurrentModuleName()) || getDefaultModule()
export const setCurrentModule = (mod: Module) => setCurrentModuleName(mod.title)

export const isSidePanelOpen = _isSidePanelOpen;
export const openSidePanel = _openSidePanel;

export const getModules = _getModules;
export const initModules = (modules: Module[]) => {
    modules.forEach(mod => mod.connector?.initFn())
    setModules(() => modules)
};

