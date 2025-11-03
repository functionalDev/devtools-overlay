import { Dynamic, Portal, render } from "solid-js/web";
import type { ModuleFactory } from "../ModuleFactory.tsx";
import { createEffect, For, untrack, type Component } from "solid-js";
import { TemplateIcon } from "../../icons/TemplateIcon.jsx";
import { Button } from "../../ui/Button.tsx";
import { CopyTemplateWorkflowSteps, getCopyTemplateContext } from "./CopyTemplateContext.ts";
import { OverlayOnElement } from "./OverlayOnElement.tsx";
import { TemplateSelectionView } from "./TemplateSelectionView.tsx";
import { TemplateInsertionView } from "./TemplateInsertionView.tsx";
import { DataSourceView } from "./DataSourceView.tsx";
import { DataMappingView } from "./DataMappingView.tsx";

const { workflow, overlays } = getCopyTemplateContext();


const Actions = () => 
    <div>
        <For each={Object.entries(workflow.current.actions)}>
            {
                ([label, actionFn]) => (
                    <Button variant={"secondary"} onClick={actionFn}>
                        {label}
                    </Button>
                )
            }
        </For>
    </div>

const Header = () => 
    <div style={{
        display: 'grid',
        // "select border insert border source border mapping"
        "grid-template-columns": "max-content 1fr max-content 1fr max-content 1fr max-content",
        "grid-template-rows": "1fr 1fr",
        'grid-auto-flow': 'column dense',
        'margin-bottom': '15px',
        'column-gap': '5px',
        "font-size": 'clamp(10px, 1.5vw, 20px)',
    }}>
        <For each={(Object.values(CopyTemplateWorkflowSteps) as Array<CopyTemplateWorkflowSteps>).filter(v => typeof v === "number")}>
            {
                (step) => (
                    <>
                        <div style={{
                            'grid-row': '1 / 3',
                            border: '1px solid rgba(from currentColor r g b / 0.3)',
                            'border-radius': '10px',
                            padding: workflow.current.step === step ?'10px 3vw': '4px 2vw',
                            'place-self': 'center',
                            opacity: workflow.current.step === step ? 1: 0.5,
                        }}>
                            { workflow.current.step === step ? workflow.current.headline : workflow.getStep(step).shortName }
                        </div>
                        <div style={{ 'border-bottom': '1px solid rgba(from currentColor r g b / 0.3)', 'grid-row': '1'}}></div>
                    </>
                )
            }
        </For>
    </div>
    

const WorkflowStepToView = {
    [CopyTemplateWorkflowSteps.TemplateSelection]: TemplateSelectionView,
    [CopyTemplateWorkflowSteps.TemplateInsertion]: TemplateInsertionView,
    [CopyTemplateWorkflowSteps.DataSource]: DataSourceView,
    [CopyTemplateWorkflowSteps.DataMapping]: DataMappingView,
}

const Layout: Component = () => {
    createEffect(() => {
        const currentStep = workflow.current
        untrack(() => currentStep.init());
    });
    return (
        <div style={{
            display: 'grid',
            "grid-template-rows": 'min-content 1fr min-content',
            height: '100%',
        }}>
            <div>
                <Header/>
            </div>
            <div>
                <Dynamic component={WorkflowStepToView[workflow.current.step]}/>
            </div>
            <div>
                <Actions/>
            </div>
            <Portal mount={document.body}>
                <For each={overlays.getAll()}>{
                    pos => <OverlayOnElement element={pos}/>
                }</For>
            </Portal>
        </div>
)}

export const CopyTemplateModule: ModuleFactory = () => {
    return {
        MainView: Layout,
        title: 'Copy Template',
        Icon: <TemplateIcon/>,
        render
}
}