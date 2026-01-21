import type { Component, JSX } from "solid-js"

export const FieldLabel: Component<JSX.HTMLAttributes<HTMLLabelElement>> = props => {
    return (
        <label {...props} class={`${props.class ?? ""} text-[14px] opacity-70 self-center justify-self-end`} />
    )
}