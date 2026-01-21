import type { Module, ModuleFactory } from "./ModuleFactory.tsx";
import { createEffect, createSignal, For, Show } from "solid-js";
import "@andypf/json-viewer"
import { render } from "solid-js/web";
import { Button } from "../ui/Button.tsx";

type Filter<T> = {
    label: T[keyof T],
    fn: (t: T) => boolean,
}

function getValuesOfField<T>(fieldName: keyof T, list: T[]): Filter<T>[] {
    return [...new Set(list.map(e => e[fieldName]))].map(label => ({
    label,
    fn: (dataEntry: T) => dataEntry[fieldName] === label
}))
}

export type DataTableOptions<T> = {
        getDataList: () => T[],
        columnDataFns: ((t: T) => (keyof T))[],
        columnNames: string[],
        fieldFilter: keyof T,
}


export function createDataTableModuleFactory<T extends Record<string, string | number | object>>(options: DataTableOptions<T>, params: Omit<Module, 'MainView'>): ModuleFactory {
    const [ getSelectedRow, setSelectedRow ] = createSignal<T | null>(null);
    return () => ({
        ...params,
        MainView: ({ isSidePanelOpen, openSidePanel }) => {
            const { fieldFilter, columnNames, columnDataFns, getDataList } = options;
            const getFilters = () => getValuesOfField(fieldFilter, getDataList());
            const [ currentFilters, setFilters] = createSignal<Filter<T>[]>([]);
            const [ showAll, setShowAll ] = createSignal(true);
        
            
            createEffect(() => {
                if(!isSidePanelOpen()){
                    setSelectedRow(null);
                }
            })
            const handleRowClick = (row: T) => {
                if(getSelectedRow() !== row) {
                    setSelectedRow(() => row);
                    openSidePanel(() => true);
                } else {
                    setSelectedRow(null);
                    openSidePanel(() => false);
                }                
            }
            const toggleFilter = (filter: Filter<T>) => {
                const hasFilter = currentFilters().map(f => f.label).includes(filter.label);
                !hasFilter
                    ? setFilters(list => [...list, filter])
                    : setFilters(list => list.filter(entry => entry.label !== filter.label))
            }
            return (
                <Show when={getDataList().length > 0} fallback={<div style={{ background: '#fdeeee', padding: "12px 18px", margin: '5px', "border-radius": '5px', color: 'black' }}><div style={{ display: 'inline-block',color: 'red', border: '1px solid red', "width": '1em', "text-align": "center", "border-radius": '50%' }}>! </div> No tracking data found!</div>}>
                        <div style={{
                    'margin-top': '20px',
                }} >
                    <For each={getFilters()}>{
                        filter =>  (
                            <Button 
                                variant={currentFilters().map(f => f.label).includes(filter.label) ? 'primary' :'secondary'}
                                onClick={() => {
                                    toggleFilter(filter);
                                    if(currentFilters().length === getFilters().length || currentFilters().length === 0){
                                        return setShowAll(true);
                                    }
                                    setShowAll(false);
                                }}
                            >
                                {filter.label as string}
                            </Button> 
                    )}</For>
                    <table style={{ 
                        'margin-block': '25px',
                        display: 'table',
                        width: '100%',
                        'border-collapse': 'collapse',
                        'border-spacing': '0px',
                     }}>
                        <thead>
                            <tr 
                                        style={{ 
                                            'border-bottom': '1px solid currentColor',
                                        }}>
                                <For each={columnNames}>{
                                    columnName => <td style={{color: 'var(--text-default)', padding: "6px 16px"}}>{columnName}</td>
                                }</For>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={getDataList().filter(entry => showAll() || currentFilters().some(({ fn }) => fn(entry)))}>{
                                row => (
                                    <tr 
                                        // selected={getSelectedRow() === row} 
                                        onClick={() => handleRowClick(row)}
                                        style={{ 
                                            'border-bottom': '1px solid currentColor',
                                        }}
                                    >
                                        <For each={columnDataFns}>{
                                            columnDataFn => <td style={{color: 'var(--text-default)', padding: "6px 16px"}}>{columnDataFn(row) as string}</td>
                                        }</For>
                                    </tr>
                            )}</For>
                        </tbody>
                    </table>
                </div>
                </Show>
                
        )},
        SidePanel: (props) => <>
            {/* 
            // @ts-expect-error typescript doesnt register web-component  from "@andypf/json-viewer" */}
            <andypf-json-viewer show-toolbar="true" theme={props.colorScheme === 'light' ? 'default-light' : 'default-dark'} show-data-types="false"  data={JSON.stringify(getSelectedRow())}></andypf-json-viewer>
        </>,
        render,
    })
}