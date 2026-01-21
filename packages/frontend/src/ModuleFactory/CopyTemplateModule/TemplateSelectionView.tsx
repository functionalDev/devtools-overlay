import { createSignal, For, type Component } from "solid-js"
import { Button } from "../../ui/Button"
import { getCopyTemplateContext } from "./CopyTemplateContext"
import { workflowStepToColor } from "./OverlayOnElement";
import { Input } from "../../ui/Input";
import { ToggleButton } from "../../ui/ToggleButton";
import { Divider } from "../../ui/Divider";
import { ErrorMessage } from "../../ui/ErrorMessage";


const [templateSelector, setTemplateSelector] = createSignal("section[id][data-tracking-name]");
export const templatesSelectable = () => {
    try {
        return Array.from(document.querySelectorAll<HTMLElement>(templateSelector()))
    } catch {
        return [];
    }
}

const { overlays, template, workflow } = getCopyTemplateContext();

const setOverlayToSelectable = () => overlays.set(templatesSelectable())

const manualSelectionHandler = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    const foundTemplate = target.closest(templateSelector()) as HTMLElement | undefined;
    if(!foundTemplate) return;
    template.select(foundTemplate); 
    workflow.nextStep();
}

export const TemplateSelectionView: Component = () => {
    return (
    <div>     
        <div class="grid grid-flow-col auto-cols-[min-content] gap-1">
            <Input
                style={{ "text-align": 'center', 'font-size': '0.8em', 'width': `calc(${templateSelector().length - 3}ch)`}} 
                value={templateSelector()} 
                onInput={(event) => (setTemplateSelector(event.target.value), setOverlayToSelectable())}
            />
            <ToggleButton 
                // @ts-ignore no idea why ts throws on build here
                onOn={() => document.body.addEventListener('click', manualSelectionHandler, { once: true })}
                // @ts-ignore no idea why ts throws on build here
                onOff={() => document.body.removeEventListener('click', manualSelectionHandler)}
                size="s"
            >
                &#x2609;
            </ToggleButton>
            <Button 
                onClick={() => (setTemplateSelector(s => s + ' '), setOverlayToSelectable())} 
                variant="secondary" 
                size="s"
            >
                &#8634;
            </Button>
        </div>
        <Divider/>
        <div class="grid">
            <For fallback={<ErrorMessage>No elements found</ErrorMessage>} each={templatesSelectable()}>
                {(element) =>
                    <Button 
                        size="s"
                        variant="neutral"
                        class={`bg-[${workflowStepToColor[0]}] [text-align:start]`}
                        onMouseEnter={() => overlays.setToElement(element)} 
                        onMouseLeave={setOverlayToSelectable}
                        onClick={() => (element.scrollIntoView({ behavior: "smooth", block: "end" }), template.select(element), workflow.nextStep())} 
                    >
                        {element.dataset["trackingName"] || element.textContent?.substring(0, 150)}
                    </Button>
                }
            </For>
        </div>
    </div>
    )
}