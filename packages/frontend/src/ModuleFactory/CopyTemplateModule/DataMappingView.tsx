import { getCopyTemplateContext, type DataSource } from "./CopyTemplateContext";
import { createMemo, createResource, createSignal, For, Match, Show, Switch, type Component } from "solid-js";
import { flattenObject } from "../../commonUtils";
import { Button } from "../../ui/Button";
import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import { workflowStepToColor } from "./OverlayOnElement";
import { ErrorMessage } from "@kobalte/core/switch";
import { Divider } from "../../ui/Divider";
import { FieldLabel } from "../../ui/FieldLabel";
import { Input } from "../../ui/Input";


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
    const changeTextContentForSelector = (selector: string, label: string, type?: 'text' | 'image', dataIn?: string) => {
        try{
            if(type === 'text'){
                const elements = template.getCopy()?.querySelectorAll(selector) as HTMLElement[] | undefined;
                if(!elements?.length) return;
                elements.forEach((element, index) => {
                    const text = customfields[label]?.value || flattenObject(data()?.data.peachExperimentContents[index])[label] || dataIn
                    element.textContent = text;
                })
            }
            
            if(type === 'image'){
                const elements = template.getCopy()?.querySelectorAll(selector) as HTMLImageElement[] | undefined;
                if(!elements?.length) return;
                elements.forEach((element, index) => {
                    const flatData = flattenObject(data()?.data.peachExperimentContents[index]);
                    const newSrc = flatData[label]?.replace('${formatId}', '604');
                    element.src &&= newSrc;
                    element.removeAttribute('srcset');
                    element.parentElement?.querySelectorAll('source').forEach(source => source.remove())
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
                <ErrorMessage>
                    {data.error}    
                </ErrorMessage>
            </Match>
            <Match when={!data.loading && !data()?.data.peachExperimentContents.length}>
                <ErrorMessage>
                     Empty list returned  
                </ErrorMessage>
            </Match>
            <Match when={data()?.data.peachExperimentContents.length}>
                    <div 
                        class="
                            grid 
                            grid-cols-[min-content_max-content_1fr_max-content_max-content_max-content]
                            gap-[5px]
                            mb-[10px]" 
                    >
                    <div class="grid grid-cols-[subgrid] grid-col-[1/-1]">
                        <label></label>
                        <div></div>
                        <div></div>
                        <Button variant="neutral" title="apply all" class={`bg-[${workflowStepToColor[3]}]`}  size="xs" onClick={() => signalEntries().filter(({ label }) => !deletedFields().includes(label)).forEach(entry => changeTextContentForSelector(entry.getter(), entry.label, entry.typeGetter()))}>&#9658; ALL</Button>
                        <Button variant="neutral" title="restore fields" class={`bg-[${workflowStepToColor[3]}]`}  size="xs" onClick={() => setDeletedFields([])}>++</Button>
                        {/* @ts-ignore */}
                        <div></div>
                    </div>
                <Divider/>
                <For each={signalEntries().filter(({ label }) => !deletedFields().includes(label))}>
                    {
                        ({label, getter, setter, typeGetter, typeSetter }) => (
                            
                            <div class="hover:bg-[rgba(from_currentColor_r_g_b_/_0.1)] grid grid-cols-[subgrid] grid-col-[1/-1] gap-[5px]"
                                onMouseEnter={() => getter() && setOverlayForSelector(getter())}
                                onMouseLeave={() => (document.activeElement as HTMLInputElement | undefined)?.value ? setOverlayForSelector((document.activeElement as HTMLInputElement).value) :overlays.clear}
                            >
                                {/* <label style={{ 'align-self': 'center', 'font-size': '0.8em'}} onMouseEnter={() => setOverlayForSelector(getter())}>{label}</label> */}
                                <FieldLabel>{label}</FieldLabel>
                                <Input 
                                    id={`data-mapping-field-${label}`} 
                                    placeholder="html#css.selector"
                                    value={getter()} 
                                    onBlur={overlays.clear}
                                    onInput={(event) => (setter(event.target.value), setOverlayForSelector(event.target.value))}/>
                                <Show when={customfields[label]}>
                                     <Input 
                                        id={`data-mapping-field-${label}-value`} 
                                        value={customfields[label]?.value} 
                                        onBlur={overlays.clear} 
                                        onChange={(event) => (setCustomFields(label, 'value', event.target.value), changeTextContentForSelector(event.target.value, newFieldName()))} 
                                        onInput={(event) => (setCustomFields(label, 'value', event.target.value), setOverlayForSelector(event.target.value))}/>
                                </Show>
                                <Show when={!customfields[label]}>
                                    <div style={{ 'height': '50%', 'border-bottom': '1px solid rgba(from currentColor r g b / 0.2)'}}></div>
                                </Show>
                                <Button  variant="neutral" class={`bg-[${workflowStepToColor[3]}]`} size="xs" onClick={() => changeTextContentForSelector(getter(), label, typeGetter())}>&#9658;</Button>
                                {/* @ts-ignore */}
                                <Button variant="secondary" size="xs" onClick={() => customfields[label] ? setCustomFields(label, undefined) : setDeletedFields(s => [...s, label])}>-</Button>
                                {/* @ts-ignore */}
                                <select value={typeGetter()} onChange={(event) => typeSetter(event.target.value)}>
                                    <option value="text">text</option>
                                    <option value="image">image</option>
                                </select>
                            </div>
                            
                        )
                    }
                </For>
                 <Input 
                    id={`data-mapping-field-new-name`} 
                    placeholder="name"
                    class="text-end"
                    value={newFieldName()} 
                    onChange={(event) => (setNewFieldName(event.target.value), changeTextContentForSelector(event.target.value, newFieldName()))} 
                    onInput={(event) => (setNewFieldName(event.target.value), setOverlayForSelector(event.target.value))}
                />
                <Input 
                    id={`data-mapping-field-new-selector`} 
                    class="w-[20vw] min-w-[200px]"
                    value={newFieldSelector()} 
                    placeholder="html#css.selector"
                    onBlur={overlays.clear}
                    onChange={(event) => (setNewFieldSelector(event.target.value), changeTextContentForSelector(event.target.value, newFieldSelector()))} 
                    onInput={(event) => (setNewFieldSelector(event.target.value), setOverlayForSelector(event.target.value))}
                    onKeyDown={(event) => newFieldSelector() && newFieldName() && event.key === 'Enter' &&
                        (
                            newFieldSelector() && newFieldValue() && changeTextContentForSelector(newFieldSelector(), newFieldName(), 'text', newFieldValue()),
                            setCustomFields(s => ({ ...s, [newFieldName()]: { selector: newFieldSelector(), value: newFieldValue() }})),
                            setNewFieldName(''),
                            setNewFieldSelector(''),
                            setNewFieldValue('')
                        )}  
                    />
                    <Input 
                        id={`data-mapping-field-new-value`} 
                        placeholder="data"
                        value={newFieldValue()} 
                        onBlur={overlays.clear} 
                        onFocus={() => setOverlayForSelector(newFieldSelector())}
                        onChange={(event) => setNewFieldValue(event.target.value)} 
                        onInput={(event) => setNewFieldValue(event.target.value)}
                        onKeyDown={(event) => newFieldValue() && newFieldName() && event.key === 'Enter' &&
                            (
                                changeTextContentForSelector(newFieldSelector(), newFieldName(), 'text', newFieldValue()),
                                setCustomFields(s => ({ ...s, [newFieldName()]: { selector: newFieldSelector(), value: newFieldValue() }})),
                                setNewFieldName(''),
                                setNewFieldSelector(''),
                                setNewFieldValue('')
                            )} 
                    />

                </div>
            </Match>
        </Switch>
    </div>
    )
}