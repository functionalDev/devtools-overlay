import { createSignal, For, type Component } from "solid-js"
import { Button } from "../../ui/Button"
import { getCopyTemplateContext } from "./CopyTemplateContext"
import { colors } from "@devtoolsoverlay/shared";


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

export const TemplateSelectionView: Component = () => {
    return (
    <div>     
        <input 
            onFocus={setOverlayToSelectable} 
            style={{ "text-align": 'center', padding: '5px 0px', 'font-size': '0.8em', 'width': `calc(${templateSelector().length - 3}ch)`}} 
            value={templateSelector()} 
            onInput={(event) => (setTemplateSelector(event.target.value), setOverlayToSelectable())}>
        </input>
        <Button style="margin-left: 2px" onClick={() => (setTemplateSelector(s => s + ' '), setOverlayToSelectable())} variant="secondary" size="s">&#8634;</Button>
        <hr style={{ 'grid-column': '1 / -1', width: '96%', margin: '5px', 'margin-left': '2%', 'border-color': 'rgba(from currentColor r g b / 0.5)'}}/>
        <div style={{
            display: 'grid',
        }}>
            <For fallback={<span style={{color: 'white', background: colors.red, padding: '3px'}}>No elements found</span>} each={templatesSelectable()}>
                {
                    (element) => 
                        <Button 
                            size="s"
                            onMouseEnter={() => overlays.setToElement(element)} 
                            onMouseLeave={setOverlayToSelectable}
                            onClick={() => (template.select(element), workflow.nextStep())} 
                            style={{
                            "text-align": 'start',
                            }}>
                        {element.dataset["trackingName"] || element.textContent}
                    </Button>
                }
            </For>
        </div>
    </div>
    )
}