import { Alert, Table, TableBody, TableCell, TableHead, TableRow, ToggleButton, ToggleButtonGroup } from "@suid/material";
import type { Module, ModuleFactory } from "./ModuleFactory.tsx";
import { createEffect, createSignal, For, Show } from "solid-js";
import { useUIContext } from "../UIContext.tsx";
import "@andypf/json-viewer"

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
        MainView: () => {
            const { fieldFilter, columnNames, columnDataFns, getDataList } = options;
            const filters = getValuesOfField(fieldFilter, getDataList())
            const [ currentFilters, setFilters] = createSignal(filters);
            
            const { isSidePanelOpen, openSidePanel } = useUIContext();
            
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
                        value={currentFilters()}
                        onChange={(event, newfilters) => {
                            setFilters(newfilters);
                        }}>
                        <For each={filters}>{
                            filter =>  <ToggleButton size="small" value={filter}>{filter.label as string}</ToggleButton> 
                        }</For>
                    </ToggleButtonGroup>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <For each={columnNames}>{
                                    columnName => <TableCell>{columnName}</TableCell>
                                }</For>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <For each={getDataList().filter(entry => currentFilters().some(({ fn }) => fn(entry)))}>{
                                row => (
                                    <TableRow selected={getSelectedRow() === row} onClick={() => handleRowClick(row)}>
                                        <For each={columnDataFns}>{
                                            columnDataFn => <TableCell>{columnDataFn(row) as string}</TableCell>
                                        }</For>
                                    </TableRow>
                            )}</For>
                        </TableBody>
                    </Table>
                </div>
                </Show>
                
        )},
        SidePanel: () => <>
            {/* 
            // @ts-expect-error typescript doesnt register web-component  from "@andypf/json-viewer" */}
            <andypf-json-viewer data={JSON.stringify(getSelectedRow())}></andypf-json-viewer>
        </>
    })
}