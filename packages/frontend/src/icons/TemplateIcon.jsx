import { workflowStepToColor } from "../ModuleFactory/CopyTemplateModule/OverlayOnElement"

export const TemplateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" version="1.1">
    <g id="Page-1" stroke="currentColor" stroke-width="2" fill="currentColor" fill-rule="evenodd">
        <g id="icon" fill="currentColor" transform="translate(42.666667, 85.333333)">
            <path fill={workflowStepToColor[0]} d="M128,1.42108547e-14 L128,149.333333 L7.10542736e-15,149.333333 L7.10542736e-15,1.42108547e-14 L128,1.42108547e-14 Z">
            </path>
            <path fill={workflowStepToColor[1]} d="M426.666667,1.42108547e-14 L426.666667,149.333333 L170.666667,149.333333 L170.666667,1.42108547e-14 L426.666667,1.42108547e-14 Z">
            </path>
            <path fill={workflowStepToColor[2]} d="M256,192 L256,341.333333 L7.10542736e-15,341.333333 L7.10542736e-15,192 L256,192 Z">
            </path>
            <path fill={workflowStepToColor[3]} d="M426.666667,192 L426.666667,341.333333 L298.666667,341.333333 L298.666667,192 L426.666667,192 Z">
            </path>
        </g>
    </g>
</svg>
)