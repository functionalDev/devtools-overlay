import { Alert, Table, TableBody, TableCell, TableHead, TableRow, ToggleButton, ToggleButtonGroup } from "@suid/material";
import type { Module, ModuleFactory } from "./ModuleFactory.tsx";
import { createEffect, createSignal, For, Show } from "solid-js";
import "@andypf/json-viewer"
import { render } from "solid-js/web";

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
            return (
                <Show when={getDataList().length > 0} fallback={<Alert severity="error">No tracking data found!</Alert>}>
                        <div style={{
                    'margin-top': '20px',
                }} >
                    <ToggleButtonGroup
                        sx={{
                            paddingLeft: '16px',
                        }}
                        value={showAll() ? getFilters().map(f => f.label) : currentFilters().map(f => f.label)}
                        onChange={(event, newfilters) => {
                            if(newfilters.length === getFilters().length){
                                return setShowAll(true);
                            }
                            setShowAll(false);
                            setFilters(getFilters().filter(f => newfilters.includes(f.label)));
                        }}>
                        <For each={getFilters().map(f => f.label)}>{
                            filterlabel =>  <ToggleButton style={{
                                color: 'var(--text-default)', 
                                'border-color': 'var(--panel__border)',
                                'background': currentFilters().map(f => f.label).includes(filterlabel) || showAll() ? '' : 'var(--gray_highlight__color)',
                            }} 
                            size="small" 
                            value={filterlabel}
                        >
                            {filterlabel as string}
                        </ToggleButton> 
                        }</For>
                    </ToggleButtonGroup>
                    <Table size="small" style={{ 'margin-block': '25px' }}>
                        <TableHead>
                            <TableRow>
                                <For each={columnNames}>{
                                    columnName => <TableCell sx={{color: 'var(--text-default)'}}>{columnName}</TableCell>
                                }</For>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <For each={getDataList().filter(entry => showAll() || currentFilters().some(({ fn }) => fn(entry)))}>{
                                row => (
                                    <TableRow selected={getSelectedRow() === row} onClick={() => handleRowClick(row)}>
                                        <For each={columnDataFns}>{
                                            columnDataFn => <TableCell sx={{color: 'var(--text-default)'}}>{columnDataFn(row) as string}</TableCell>
                                        }</For>
                                    </TableRow>
                            )}</For>
                        </TableBody>
                    </Table>
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