import { colors } from "@devtoolsoverlay/shared";
import type { Component, JSX } from "solid-js";

export const ErrorMessage: Component<JSX.HTMLAttributes<HTMLSpanElement>> = props => {
    return (
        <span class="p-2" style={{ color: 'white', background: colors.red }}>{props.children}</span>
    )
}