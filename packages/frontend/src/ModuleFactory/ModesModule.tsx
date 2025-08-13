import type { ModuleFactory } from "./ModuleFactory.tsx";
import { createEffect, createSignal, type Component } from "solid-js";
import { Switch } from "@suid/material";

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
    const [ storageValue, setStorageValue ] = createSignal(storage.getItem(props.storageKey) || 'false')

    createEffect(() => {
            storage.setItem(props.storageKey, storageValue())
    });
    return (
        <>
            <label>{props.label}</label>
            <Switch  
                checked={storageValue() === 'true'}
                onChange={() => {
                    setStorageValue(s => s === 'true'? 'false': 'true')
                }}
            />
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
            <label>{props.label}</label>
            <Switch  
                checked={storageValue() === props.value}
                onChange={(event, value) => {
                    setStorageValue((s) => s === props.value ? 'null': props.value)
                }}
            />
        </>
    )
}

export const ModesModule: ModuleFactory = () => ({
        MainView: () => (
            <div style={{
                display: 'grid',
                "grid-template-columns": 'max-content 1fr',
                "align-items": 'center',
                gap: '5px',
                padding: '5px',
            }}>
                <StorageButton storageType={StorageType.SESSION_STORAGE} storageKey="next-features" label="next features"/>
                <QueryParamButton queryParam='mobileapp' value="true" label="mobile mode"/>
                <QueryParamButton queryParam='pagestats' value="true" label="page stats"/>
                <StorageButton storageType={StorageType.LOCAL_STORAGE} storageKey="forced-dark-theme" label="dark mode"/>
            </div>
        ),
        title: 'Modes',
})