import { createSignal } from "solid-js";

export enum CopyTemplateWorkflowSteps  {
    TemplateSelection = 0,
    TemplateInsertion = 1,
    DataSource = 2,
    DataMapping = 3,
}

// WORKFLOW
const [ workflowStep, setWorkflowStep] = createSignal(CopyTemplateWorkflowSteps.TemplateSelection);
const abort = () => {
    setWorkflowStep(CopyTemplateWorkflowSteps.TemplateSelection) 
}
const back = () => setWorkflowStep(s => Math.max(0, s - 1)) 

// template selection
const [templateSelected, setTemplateSelected] = createSignal<HTMLElement | null>(null)

export type DataSource = {
    name: string,
    path: string,
    fields: Record<string, string>,
}
// data source
const [selectedDataSource, setSelectedDataSource] = createSignal<DataSource | null>(null);

const [overlays, setOverlays] = createSignal<HTMLElement[]>([]);

const [copiedElement, setCopiedElement] = createSignal<HTMLElement | null>(null)


const Workflow = {
    [CopyTemplateWorkflowSteps.TemplateSelection]: {
        step: CopyTemplateWorkflowSteps.TemplateSelection,
        init: () => {
            setTemplateSelected(null);
            copiedElement()?.remove();
            setCopiedElement(null);
        },
        actions: {},
        headline: 'Select an element on the page to copy',
        shortName: 'select',
    },
    [CopyTemplateWorkflowSteps.TemplateInsertion]: {
        step: CopyTemplateWorkflowSteps.TemplateInsertion,
        init: () => {
            if(!templateSelected()){
                setWorkflowStep(0);
            }
            copiedElement()?.remove();
            setCopiedElement(null);
        },
        actions: {
            'Back': back,
        },
        headline: 'Pick place to insert the copy',
        shortName: 'insert'
    },
    [CopyTemplateWorkflowSteps.DataSource]: {
        step: CopyTemplateWorkflowSteps.DataSource,
        init: () => {
            setOverlays([]);
        },
        actions: {
            'Back': back,
        },
        headline: 'Select a data source',
        shortName: 'source',
    },
    [CopyTemplateWorkflowSteps.DataMapping]: {
        step: CopyTemplateWorkflowSteps.DataMapping,
        init: () => {
            if(!selectedDataSource()){
                setWorkflowStep(CopyTemplateWorkflowSteps.TemplateSelection);
            }
        },
        actions: {
            'Back': back,
            'Abort': abort,
            'Done': () => {
                setCopiedElement(null);
                setWorkflowStep(0);
            }
        },
        headline: 'Map data to text content in element',
        shortName: 'mapping',
    }
}

// workflow
const workflowContext = {
    get current() {
        return Workflow[workflowStep()];
    },
    nextStep: () => setWorkflowStep(s => (s + 1)%Object.keys(CopyTemplateWorkflowSteps).length),
    getStep: (step: CopyTemplateWorkflowSteps) => Workflow[step]
}

// templates
const templateContext = {
    select: (element: HTMLElement) => setTemplateSelected(element),
    get: () => templateSelected(),
    insertCopy: (insertBeforeThisElement: HTMLElement) =>{
        const copy = templateSelected()?.cloneNode(true) as HTMLElement | null;
        if(!copy) return;
        copy.id = 'some-random';
        copy.dataset["trackingName"] = copy.dataset["trackingName"] + '-copy'
        const parentNode = insertBeforeThisElement.parentNode;
        parentNode?.insertBefore(copy, insertBeforeThisElement);
        setCopiedElement(copy);
    },
    getCopy: () => copiedElement(),
}

// overlays
const overlaysContext = {
    getAll: () => overlays(),
    clear: () => setOverlays([]),
    set: (elements: HTMLElement[]) => setOverlays(elements),
    setToElement: (element: HTMLElement) => setOverlays([element]),
}

// dataSource
const dataSourceContext = {
    select: (dataSource: DataSource) => setSelectedDataSource(dataSource),
    get: () => selectedDataSource(),
}

export const getCopyTemplateContext = () => ({
    overlays: overlaysContext,
    workflow: workflowContext,
    template: templateContext,
    dataSource: dataSourceContext
})