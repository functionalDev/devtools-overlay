import type { Component } from "solid-js"
import { CopyTemplateWorkflowSteps, getCopyTemplateContext } from "./CopyTemplateContext"

const { workflow } = getCopyTemplateContext();

export const workflowStepToColor = {
    [CopyTemplateWorkflowSteps.TemplateSelection]: 'rgba(68,138,218,0.5)',
    [CopyTemplateWorkflowSteps.TemplateInsertion]: 'rgba(218,68,68,0.5)',
    [CopyTemplateWorkflowSteps.DataSource]: 'rgba(103,218,68,0.5)',
    [CopyTemplateWorkflowSteps.DataMapping]: 'rgba(218,208,68,0.5)',
}

export const OverlayOnElement: Component<{element:  HTMLElement, color?: string}> = props => {
    return (
        <>
            <div style={{
                position: 'absolute',
                top: `${props.element.getBoundingClientRect().top + window.scrollY +2}px`,
                left: `${props.element.getBoundingClientRect().left +2}px`,
                width: `${props.element.getBoundingClientRect().width -4}px`,
                height: `${props.element.getBoundingClientRect().height -4}px`,
                background: props.color || workflowStepToColor[workflow.current.step],
                'pointer-events': 'none',
                'z-index': 999,
            }}>
            </div>
            <div style="display:none;">
                Just put unocss classes needed later
                <span class="bg-[rgba(68,138,218,0.5)] bg-[rgba(218,68,68,0.5)] bg-[rgba(103,218,68,0.5)] bg-[rgba(218,208,68,0.5)] "/>
            </div>
        </>
    )
} 