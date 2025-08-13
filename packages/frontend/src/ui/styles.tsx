import * as s from 'solid-js'
import * as theme from '@devtools/shared/theme'
import {custom_scrollbar_styles} from './scrollable.tsx'
import {toggle_button_styles} from './toggle-button.tsx'
import { tag_brackets } from './commonConsts.ts'

export {
    highlight_color_var,
    highlight_container,
    highlight_element,
    highlight_opacity_var,
} from './highlight.tsx';

export {toggle_button, toggle_button_styles} from './toggle-button.tsx';


export const tag_brackets_styles = /*css*/ `
    .${tag_brackets}:before {
        content: '\<';
        color: ${theme.vars.disabled};
    }
    .${tag_brackets}:after {
        content: '>';
        color: ${theme.vars.disabled};
    }
`

export const devtools_root_class = 'devtools-root'

export function Styles(): s.JSXElement {
    const var_styles = theme.make_var_styles(devtools_root_class)

    return (
        <style>
            {var_styles}
            {toggle_button_styles}
            {tag_brackets_styles}
            {custom_scrollbar_styles}
        </style>
    )
}
