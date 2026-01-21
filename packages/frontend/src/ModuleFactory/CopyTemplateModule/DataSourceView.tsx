import { getCopyTemplateContext, type DataSource } from "./CopyTemplateContext";
import { Button } from "../../ui/Button";
import { createSignal, For, Show, type Component } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import { workflowStepToColor } from "./OverlayOnElement";
import { Label } from "../../ui/Label";
import { Input } from "../../ui/Input";
import { FieldLabel } from "../../ui/FieldLabel";
import { Divider } from "../../ui/Divider";


const { workflow, dataSource } = getCopyTemplateContext();

const [ datasources, setDataSources ] = makePersisted(createSignal<DataSource[]>([]), {
    name: 'devtools-overlay-copy-template-datasources',
    storage: localStorage,
});
const [showDetails, setShowDetails] = createSignal<boolean>(false)
const [newQueryName, setNewQueryName] = createSignal<string>('')
const [newQueryPath, setNewQueryPath] = createSignal<string>('')
const [newQueryNewFieldName, setNewQueryNewFieldName] = createSignal<string>('');
const [newQueryNewField, setNewQueryNewField] = createSignal<string>('');
const [newQueryFields, setNewQueryFields] = createSignal<Record<string, string>>({});

const addDataSource = (dataSource: DataSource) => setDataSources(s => [...s, dataSource]);
const deleteDataSourceAtIndex = (index: number) => (setDataSources(s => s.toSpliced(index, 1)));

const dublicateDataSourceAtIndex = (dataSource: DataSource) => {
    const copy = {...dataSource, name: `${dataSource.name}-copy`};
    addDataSource(copy);
    setDataSourceIntoDetails(copy);
}

const getDataSourceFromDetails = (): DataSource => ({ name: newQueryName(), path: newQueryPath(), fields: newQueryFields() })
const setDataSourceIntoDetails = (source: DataSource) => {
    setShowDetails(true);
    setNewQueryName(source.name);
    setNewQueryPath(source.path);
    setNewQueryFields(source.fields);
}

const saveDataSource = (dataSource: DataSource) => {
    const indexOfExistingDataSource = datasources().findIndex(({ name }) => name === dataSource.name)
    indexOfExistingDataSource >= 0
        ? setDataSources(s => s.toSpliced(indexOfExistingDataSource, 1, dataSource))
        : addDataSource(dataSource)
}

export const DataSourceView: Component = () => {
    let ref: HTMLInputElement | undefined;
    
    return (
    <div style={{ display: 'grid', padding: '10px', gap: '0px' }}>
        <For each={datasources()}>{
            (source: DataSource, index) => (
                <div 
                    class="hover:bg-[rgba(from_currentColor_r_g_b_/_0.05)] 
                        grid
                        grid-flow-col
                        auto-cols-[min-content]
                        grid-cols-[max-content_1fr]
                        gap-[3px]
                        p-[1px]"
                >
                    <Label class="bg-[rgba(100,100,100,0.1)] dark:bg-[rgba(255,255,255,0.1)]">{source.name}</Label>
                    <div class="h-[50%] border-b border-b-solid border-b-[rgba(from_currentColor_r_g_b_/_0.2)] "></div>
                    <Button variant="neutral" title="use" size="s" class={`bg-[${workflowStepToColor[2]}]`} onClick={() => (dataSource.select(source), workflow.nextStep())}>&#9658;</Button>
                    <Button variant="secondary" title="edit" size="s" onClick={[setDataSourceIntoDetails, source]}>✎</Button>
                    <Button variant="secondary" title="copy" size="s" onClick={[dublicateDataSourceAtIndex, source]}>&#10063;</Button>
                    <Button variant="secondary" title="delete" size="s" onClick={[deleteDataSourceAtIndex, index()]}>🗑</Button>
                </div>
        )}</For>
        <Show when={!showDetails()}>
            <Button 
                variant="neutral"
                class={`bg-[${workflowStepToColor[2]}] col-[1_/_-1] mt-[20px]`}
                onClick={() => setShowDetails(true)}
            >
                +
            </Button>
        </Show>
        <Show when={showDetails()}>
            <div style={{ display: 'grid', "grid-template-columns": 'max-content 1fr', 'gap': '15px'}}>
                
                <h5 style={{ "text-align": 'center', 'grid-column': '1/-1', 'margin': '20px 0 0' }}>Edit Data source</h5>
                <FieldLabel>name</FieldLabel><Input value={newQueryName()} onInput={(event) => setNewQueryName(event.target.value)}></Input>
                <FieldLabel>path</FieldLabel><Input value={newQueryPath()} onInput={(event) => {
                    const [path = '', query] = event.target.value.split('?');
                    const queryAsObject = Object.fromEntries(new URLSearchParams(query).entries());
                        setNewQueryPath(path);
                        setNewQueryFields(queryAsObject);
                    }}>

                </Input>
                {/**** QUERY PARAMS *****/}
                <For each={Object.entries(newQueryFields())}>
                    { ([fieldName, fieldValue]) => (
                        <>
                            <FieldLabel>{fieldName}</FieldLabel>
                            <div style={{ 'display': 'grid', 'gap': '5px', 'grid-template-columns': '1fr min-content'}}>
                                <Input
                                    value={fieldValue} 
                                    onChange={(event) => setNewQueryFields(s => ({ ...s, [fieldName]: event.target.value }))}></Input>
                                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                                <Button variant="secondary" size="s" onClick={() => setNewQueryFields(({ [fieldName]: deleteMe, ...rest}) => rest)}>-</Button>
                            </div>
                        </>
                    )}
                </For>
                {/**** ADD NEW QUERY PARAM *****/}
                <Input 
                    class="text-align-end" 
                    ref={ref} 
                    placeholder="?query_value" 
                    value={newQueryNewFieldName()} 
                    onInput={(event) => setNewQueryNewFieldName(event.target.value)}
                />
                <div style={{ 'display': 'grid', 'gap': '5px', 'grid-template-columns': '1fr min-content'}}>
                    <Input
                        placeholder="=query_name" 
                        onKeyDown={(event) => newQueryNewField() && newQueryNewFieldName() && event.key === 'Enter' &&
                            (setNewQueryFields(s => ({ ...s, [newQueryNewFieldName()]: newQueryNewField()})), setNewQueryNewField(''), setNewQueryNewFieldName(''), ref?.focus())}  
                        value={newQueryNewField()} 
                        onInput={(event) => setNewQueryNewField(event.target.value)}>
                    </Input>
                    <Button variant="secondary" size="xs" onClick={() => (setNewQueryFields(s => ({ ...s, [newQueryNewField()]: ''})))}>+</Button>
                </div>
                <Divider/>
                <div class="grid grid-cols-2 col-[1/-1] gap-[3px]">
                    {/*** USE *****/}
                    <Button variant="neutral" disabled={!newQueryPath()} class={`bg-[${workflowStepToColor[2]}]`} onClick={() => (dataSource.select({ name: newQueryName(), path: newQueryPath(), fields: newQueryFields() }), workflow.nextStep())}>&#9658;</Button>
                    {/*** SAVE *****/}
                    <Button variant="secondary" disabled={!newQueryName()} onClick={() => saveDataSource(getDataSourceFromDetails())}>SAVE</Button>
                </div>
            </div>
        </Show>
    </div>
    )
}
