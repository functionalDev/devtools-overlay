
import { For, type Component } from "solid-js";
import { getCopyTemplateContext } from "./CopyTemplateContext";
import { templatesSelectable } from "./TemplateSelectionView";
import { Button } from "../../ui/Button";
import { workflowStepToColor } from "./OverlayOnElement";


const { template, workflow, overlays } = getCopyTemplateContext();

export const TemplateInsertionView: Component = () => {
    return (    
        <div class="grid">
            <For each={templatesSelectable()}>
                {(element) => 
                    <>
                        <Button 
                            variant="neutral"
                            class={`bg-[${workflowStepToColor[1]}]`}
                            size="xs"
                            onClick={() => (element.scrollIntoView({ behavior: "smooth", block: "end" }), template.insertCopy(element), workflow.nextStep())}
                        >
                            +
                        </Button>
                        <div 
                            onMouseEnter={() => overlays.setToElement(element)} 
                            onMouseLeave={overlays.clear} 
                            class={`text-[14px] px-1 py-1 font-medium [text-align:start] ${template.get() === element ? "bg-[rgba(0,117,163,0.1)] dark:bg-[rgba(0,117,163,0.2)]" : ""}`}
                        >
                            {element.dataset["trackingName"] || element.textContent?.substring(0,200)}
                        </div>
                    </>
                }
            </For>
        </div>
    )
}