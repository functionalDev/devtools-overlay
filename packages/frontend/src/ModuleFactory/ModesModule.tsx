import type { ModuleFactory } from "./ModuleFactory.tsx";
import { createEffect, createSignal, type Component } from "solid-js";
import { render } from "solid-js/web";
import { ModesIcon } from "../icons/ModesIcon.jsx";
import { Switch } from "../ui/Switch.tsx";

export enum StorageType {
    LOCAL_STORAGE,
    SESSION_STORAGE,
}
const StorageButton: Component<{
    storageType: StorageType,
    storageKey: string,
    label: string,
}> = (props) => {
    const storage = props.storageType === StorageType.LOCAL_STORAGE ? localStorage: sessionStorage
    const [ storageValue, setStorageValue ] = createSignal(storage.getItem(props.storageKey))

    createEffect(() => {
        const value = storageValue();
        if(value){
            storage.setItem(props.storageKey, value)
            window.dispatchEvent(new Event('local-storage'))
        }
    });
    return (
        <>
            <Switch class="inline-flex items-center gap-2 cursor-pointer select-none"
                checked={storageValue() === 'true'}
                onChange={() => {
                    setStorageValue(s => s === 'true'? 'false': 'true')
                }}>
                    {props.label}
            </Switch>
        </>
    )
}


const QueryParamButton: Component<{
    queryParam: string,
    value: string,
    label: string,
}> = (props) => {
    const initialParams = new URLSearchParams(document.location.search);

    const [ storageValue, setStorageValue ] = createSignal(initialParams.get(props.queryParam))

    createEffect(() => {
        if(storageValue() === null){
            return;
        }
        const currentQueryParams = new URLSearchParams(document.location.search);
        const queryParam = currentQueryParams.get(props.queryParam)
        
        if(queryParam !== storageValue()) {
            // @ts-ignore we know that storageValue is not null
            currentQueryParams.set(props.queryParam, storageValue())
            document.location.search = currentQueryParams.toString();
        }
    });
    return (
        
        <>
            <Switch  
                checked={storageValue() === props.value}
                onChange={() => {
                    setStorageValue((s) => s === props.value ? 'null': props.value)
                }}
            >{props.label}</Switch>
        </>
    )
}

export const ModesModule: ModuleFactory = () => ({
        MainView: () => (
            <div style={{
                display: 'grid',
                "grid-template-columns": 'max-content',
                "align-items": 'center',
                gap: '15px',
                padding: '5px',
            }}>
                <StorageButton storageType={StorageType.SESSION_STORAGE} storageKey="next-features" label="next features"/>
                <QueryParamButton queryParam='mobileApp' value="true" label="mobile mode"/>
                <QueryParamButton queryParam='stats' value="1" label="page stats"/>
                <StorageButton storageType={StorageType.LOCAL_STORAGE} storageKey="forced-dark-theme" label="dark mode"/>
            </div>
        ),
        Icon: <ModesIcon/>,
        title: 'Modes',
        render,
})