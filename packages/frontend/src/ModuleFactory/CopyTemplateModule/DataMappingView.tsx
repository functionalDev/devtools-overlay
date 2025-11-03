import { getCopyTemplateContext, type DataSource } from "./CopyTemplateContext";
import { createMemo, createResource, createSignal, For, Match, Show, Switch, type Component } from "solid-js";
import { flattenObject } from "../../commonUtils";
import { Button } from "../../ui/Button";
import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";


const { dataSource, template, overlays } = getCopyTemplateContext();


const fetchData = (queryData: DataSource): Promise<any[]> => {
    const search = new URLSearchParams(queryData.fields);
    return fetch(`${queryData.path}?${search}`, {
        method: 'GET'
    }).then(res => res.json() as Promise<any[]>)
}

type GraphApiResponse = {
    data: {
        peachExperimentContents: any[]
    }
}

const setOverlayForSelector = (selector: string) => {
    try{
        const elements = template.getCopy()?.querySelectorAll(selector) as HTMLElement[] | undefined;
        if(!elements?.length) return overlays.set([]);
        overlays.set(Array.from(elements));
    } catch {
        return overlays.set([]);
    }
}
type CustomFieldEntry = {
    value: string,
    selector: string,
}

export const DataMappingView: Component = () => {
    const [ newFieldName, setNewFieldName] = createSignal('');
    const [ newFieldValue, setNewFieldValue] = createSignal('');
    const [ newFieldSelector, setNewFieldSelector] = createSignal('');
    const [customfields, setCustomFields] = makePersisted(createStore<Record<string, CustomFieldEntry>>({}))
    // @ts-ignore
    const [data] = createResource<GraphApiResponse | undefined>(dataSource.get(), fetchData)
    const [deletedFields, setDeletedFields] = makePersisted(createSignal<string[]>([]), {
            storage: localStorage,
            name: `deleted-fields`,
        });
    const getDataFields = (): string[] => data.loading ? [] : data()?.data.peachExperimentContents.reduce((acc, next) => acc.union(new Set(Object.keys(flattenObject(next)))),new Set<string>()) || []
    const signalEntries = createMemo(() => Array.from(getDataFields()).concat(Object.keys(customfields)).map((fieldName) => {
        const [getter, setter] = makePersisted(createSignal<string>(customfields[fieldName]?.selector || ''), {
            storage: localStorage,
            name: `${fieldName}-value`,
        });
        const [typeGetter, typeSetter] = makePersisted(createSignal<'text' | 'image'>('text'), {
            storage: localStorage,
            name: `${fieldName}-type`,
        });
        return {
            label: fieldName,
            getter,
            setter,
            typeGetter,
            typeSetter,
        };
    }));
    const changeTextContentForSelector = (selector: string, label: string, type?: 'text' | 'image') => {
        try{
            if(type === 'text'){
                const elements = template.getCopy()?.querySelectorAll(selector) as HTMLElement[] | undefined;
                if(!elements?.length) return;
                elements.forEach((element, index) => {
                    const text = customfields[label]?.value || flattenObject(data()?.data.peachExperimentContents[index])[label]
                    element.textContent = text;
                })
            }
            
            if(type === 'image'){
                const elements = template.getCopy()?.querySelectorAll(selector) as HTMLImageElement[] | undefined;
                if(!elements?.length) return;
                elements.forEach((element, index) => {
                    const flatData = flattenObject(data()?.data.peachExperimentContents[index]);
                    const newSrc = flatData[label].replace('${formatId}', '604');
                    element.src = newSrc;
                })
            }
        } catch{
            return;

        }
    }
    return (
    <div>
        
        <Show when={data.loading}>
            <p>Loading...</p>
        </Show>
        <Switch>
            <Match when={data.error}>
                {data.error}
            </Match>
            <Match when={!data.loading && !data()?.data.peachExperimentContents.length}>
                <span> Empty list returned </span>
            </Match>
            <Match when={data()?.data.peachExperimentContents.length}>
                    <div style={{
                        display: 'grid',
                        'grid-template-columns': "min-content max-content 1fr max-content max-content max-content",
                        gap: '10px',
                        "margin-bottom": '10px',
                    }}
                    >
                    <div
                        style={{ display: 'grid', 'grid-template-columns': 'subgrid', 'grid-column': '1 / -1'}}
                    >
                        <label></label>
                        <div></div>
                        <div></div>
                        <Button size="xs" onClick={() => signalEntries().filter(({ label }) => !deletedFields().includes(label)).forEach(entry => changeTextContentForSelector(entry.getter(), entry.label, entry.typeGetter()))}>&#9658; ALL</Button>
                        <Button size="xs" onClick={() => setDeletedFields([])}>++</Button>
                        {/* @ts-ignore */}
                        <div></div>
                    </div>
                <hr style={{ 'grid-column': '1 / -1', width: '96%', margin: '5px', 'margin-left': '2%', 'border-color': 'rgba(from currentColor r g b / 0.5)'}}/>
                <For each={signalEntries().filter(({ label }) => !deletedFields().includes(label))}>
                    {
                        ({label, getter, setter, typeGetter, typeSetter }) => (
                            <div
                                onMouseEnter={event => {
                                    // @ts-ignore
                                    event.target.style.background = 'rgba(from currentColor r g b / 0.1)';
                                    setOverlayForSelector(getter())
                                }}
                                onMouseLeave={event => {
                                    // @ts-ignore
                                    event.target.style.background = 'none'
                                    overlays.clear();
                                }}
                                style={{ display: 'grid', 'grid-template-columns': 'subgrid', 'grid-column': '1 / -1'}}
                            >
                                <label style={{ 'align-self': 'center', 'font-size': '0.8em'}} onMouseEnter={() => setOverlayForSelector(getter())}>{label}</label>
                                <input 
                                    id={`data-mapping-field-${label}`} 
                                    placeholder="html#css.selector"
                                    style={{ padding: '5px 10px', 'width': '300px'}} 
                                    value={getter()} 
                                    onBlur={overlays.clear} 
                                    onChange={(event) => (setter(event.target.value), changeTextContentForSelector(event.target.value, label, typeGetter()))} 
                                    onInput={(event) => (setter(event.target.value), setOverlayForSelector(event.target.value))}></input>
                                <Show when={customfields[label]}>
                                     <input 
                                        id={`data-mapping-field-new`} 
                                        style={{ padding: '5px 10px', 'width': '300px'}} 
                                        value={customfields[label]?.value} 
                                        onChange={(event) => (setCustomFields(label, 'value', event.target.value), changeTextContentForSelector(event.target.value, newFieldName()))} 
                                        onInput={(event) => (setCustomFields(label, 'value', event.target.value), setOverlayForSelector(event.target.value))}></input>
                                </Show>
                                <Show when={!customfields[label]}>
                                    <div style={{ 'height': '50%', 'border-bottom': '1px solid rgba(from currentColor r g b / 0.2)'}}></div>
                                </Show>
                                <Button size="xs" onClick={() => changeTextContentForSelector(getter(), label, typeGetter())}>&#9658;</Button>
                                {/* @ts-ignore */}
                                <Button size="xs" onClick={() => customfields[label] ? setCustomFields(label, undefined) : setDeletedFields(s => [...s, label])}>-</Button>
                                {/* @ts-ignore */}
                                <select value={typeGetter()} onChange={(event) => typeSetter(event.target.value)}>
                                    <option value="text">text</option>
                                    <option value="image">image</option>
                                </select>
                            </div>
                            
                        )
                    }
                </For>
                 <input 
                    id={`data-mapping-field-new`} 
                    placeholder="name"
                    style={{ padding: '5px 10px', 'width': '300px'}} 
                    value={newFieldName()} 
                    onChange={(event) => (setNewFieldName(event.target.value), changeTextContentForSelector(event.target.value, newFieldName()))} 
                    onInput={(event) => (setNewFieldName(event.target.value), setOverlayForSelector(event.target.value))}>
                </input>
                    <input 
                        id={`data-mapping-field-value`} 
                        
                        style={{ padding: '5px 10px', 'width': '300px'}} 
                        value={newFieldSelector()} 
                        placeholder="html#css.selector"
                        onBlur={overlays.clear} 
                        onChange={(event) => (setNewFieldSelector(event.target.value), changeTextContentForSelector(event.target.value, newFieldSelector()))} 
                        onInput={(event) => (setNewFieldSelector(event.target.value), setOverlayForSelector(event.target.value))}
                        onKeyDown={(event) => newFieldSelector() && newFieldName() && event.key === 'Enter' &&
                            (
                                setCustomFields(s => ({ ...s, [newFieldName()]: { selector: newFieldSelector(), value: newFieldValue() }})),
                                setNewFieldName(''),
                                setNewFieldSelector(''),
                                setNewFieldValue('')
                            )}  
                        >
                    </input>
                    <input 
                        id={`data-mapping-field-value`} 
                        placeholder="data"
                        style={{ padding: '5px 10px', 'width': '300px'}} 
                        value={newFieldValue()} 
                        onBlur={overlays.clear} 
                        onChange={(event) => (setNewFieldValue(event.target.value), changeTextContentForSelector(event.target.value, newFieldValue()))} 
                        onInput={(event) => (setNewFieldValue(event.target.value), setOverlayForSelector(event.target.value))}
                        onKeyDown={(event) => newFieldValue() && newFieldName() && event.key === 'Enter' &&
                            (
                                setCustomFields(s => ({ ...s, [newFieldName()]: { selector: newFieldSelector(), value: newFieldValue() }})),
                                setNewFieldName(''),
                                setNewFieldSelector(''),
                                setNewFieldValue('')
                            )} 
                        >
                    </input>

                </div>
            </Match>
        </Switch>
    </div>
    )
}