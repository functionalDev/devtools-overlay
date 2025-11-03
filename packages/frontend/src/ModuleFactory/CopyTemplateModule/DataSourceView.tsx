import { getCopyTemplateContext, type DataSource } from "./CopyTemplateContext";
import { Button } from "../../ui/Button";
import { createSignal, For, Show, type Component } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";


const { workflow, dataSource } = getCopyTemplateContext();

export const DataSourceView: Component = () => {
    let ref: HTMLInputElement | undefined;
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
    
    return (
    <div style={{ display: 'grid', padding: '10px', gap: '0px' }}>
        <For each={datasources()}>{
            ({ name, fields, path }, index) => (
                <div 
                
                onMouseEnter={event => {
                    // @ts-ignore
                    event.target.style.background = 'rgba(from currentColor r g b / 0.1)';
                }}
                onMouseLeave={event => {
                    // @ts-ignore
                    event.target.style.background = 'none'
                }}
                style={{ 
                    display: 'grid', 
                    'grid-template-columns': 'max-content 1fr min-content min-content min-content', 
                    gap: '3px', 
                    padding: '1px',
                    // 'border-bottom': '1px solid rgba(from currentColor r g b / 0.5)',
                }}>
                    <label style={{ "font-size": 'clamp(12px, 1.5vw, 16px)', 'border-radius': '5px','place-self': 'center', padding: '5px 3vw', border: '1px solid rgba(from currentColor r g b / 0.2)'}}>{name}</label>
                    <div style={{ 'height': '50%', 'border-bottom': '1px solid rgba(from currentColor r g b / 0.2)'}}></div>
                    <Button title="use" size="s" onClick={() => (dataSource.select({name, fields, path}), workflow.nextStep())}>&#9658;</Button>
                    <Button variant="secondary" title="copy" size="s" onClick={() => (setShowDetails(true), setNewQueryName(`${name} copy`), setNewQueryPath(path), setNewQueryFields(fields))}>&#169;</Button>
                    <Button variant="secondary" title="delete" size="s" onClick={() => (setDataSources(s => s.toSpliced(index(), 1)))}>🗑</Button>
                </div>
        )}</For>
        <Show when={!showDetails()}>
            <Button onClick={() => setShowDetails(true)} style={{ 'grid-column': '1/-1', 'margin-top': '20px' }}>NEW</Button>
        </Show>
        <Show when={showDetails()}>
            <div style={{ display: 'grid', "grid-template-columns": 'max-content 1fr', 'gap': '15px'}}>
                
                <h5 style={{ "text-align": 'center', 'grid-column': '1/-1', 'margin': '20px 0 0' }}>Add Data source</h5>
                <label>name</label><input value={newQueryName()} onInput={(event) => setNewQueryName(event.target.value)}></input>
                <label>path</label><input value={newQueryPath()} onInput={(event) => {
                    const [path = '', query] = event.target.value.split('?');
                    const queryAsObject = Object.fromEntries(new URLSearchParams(query).entries());
                        setNewQueryPath(path);
                        setNewQueryFields((queryAsObject));
                    }}>

                    </input>
                <For each={Object.entries(newQueryFields())}>
                    { ([fieldName, fieldValue]) => (
                        <>
                            <label style={{ 'align-self': 'center'}}>{fieldName}</label>
                            <div style={{ 'display': 'grid', 'gap': '5px', 'grid-template-columns': '1fr min-content'}}>
                                <input
                                    value={fieldValue} 
                                    onChange={(event) => setNewQueryFields(s => ({ ...s, [fieldName]: event.target.value }))}></input>
                                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                                <Button size="s" onClick={() => setNewQueryFields(({ [fieldName]: deleteMe, ...rest}) => rest)}>-</Button>
                            </div>
                        </>
                    )}
                </For>
                <input ref={ref} placeholder="?query_value" value={newQueryNewFieldName()} onInput={(event) => setNewQueryNewFieldName(event.target.value)}></input>
                <div style={{ 'display': 'grid', 'gap': '5px', 'grid-template-columns': '1fr min-content'}}>
                    <input
                        placeholder="=query_name" 
                        onKeyDown={(event) => newQueryNewField() && newQueryNewFieldName() && event.key === 'Enter' &&
                            (setNewQueryFields(s => ({ ...s, [newQueryNewFieldName()]: newQueryNewField()})), setNewQueryNewField(''), setNewQueryNewFieldName(''), ref?.focus())}  
                        value={newQueryNewField()} 
                        onInput={(event) => setNewQueryNewField(event.target.value)}>
                    </input>
                    <Button size="xs" onClick={() => (setNewQueryFields(s => ({ ...s, [newQueryNewField()]: ''})))}>+</Button>
                </div>
                <hr style={{ 'border-color': 'rgba(from currentColor r g b / 0.3)', 'grid-column': '1 / -1', width: '96%', margin: '0px 2%'}}/>
                <Button onClick={() => setDataSources(s => [...s, { name: newQueryName(), path: newQueryPath(), fields: newQueryFields() }])} style={{ 'grid-column': '1/-1' }}>SAVE</Button>
                <Button variant="secondary" onClick={() => (dataSource.select({ name: newQueryName(), path: newQueryPath(), fields: newQueryFields() }), workflow.nextStep())} style={{ 'grid-column': '1/-1' }}>USE</Button>
            </div>
        </Show>
    </div>
    )
}
