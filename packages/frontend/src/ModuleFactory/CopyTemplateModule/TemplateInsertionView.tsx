
import { For, type Component } from "solid-js";
import { getCopyTemplateContext } from "./CopyTemplateContext";
import { colors } from "@devtoolsoverlay/shared";
import { templatesSelectable } from "./TemplateSelectionView";
import { Button } from "../../ui/Button";


const { template, workflow, overlays } = getCopyTemplateContext();

export const TemplateInsertionView: Component = () => {
    return (
    <div>       
        <div style={{
            display: 'grid',
        }}>
            <For fallback={<span style={{color: 'white', background: colors.red, padding: '5px'}}>No elements found</span>} each={templatesSelectable()}>
                {
                    (element) => 
                        <>
                            <Button size="xs"  onClick={() => (template.insertCopy(element), workflow.nextStep())}>+</Button>
                            <div onMouseEnter={() => overlays.setToElement(element)} onMouseLeave={overlays.clear} class="px-2 py-2 font-medium" style={{
                                "text-align": 'start',
                            }}>
                                {element.dataset["trackingName"] || element.textContent}
                            </div>
                        </>
                }
            </For>
        </div>
    </div>
    )
}