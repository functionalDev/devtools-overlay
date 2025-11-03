import { Switch as SwitchKobalte } from "@kobalte/core/switch"
import type { Component, JSXElement } from "solid-js"

export const Switch: Component<{ class?: string, children: string | JSXElement, checked: boolean, onChange: () => void }> = props => {
    return (
            <SwitchKobalte {...props} class={`inline-flex items-center gap-2 cursor-pointer select-none ${props.class}`}
                >
                <SwitchKobalte.Label class="text-sm w-25 text-gray-800 dark:text-gray-200">
                    {props.children}
                </SwitchKobalte.Label>
                <SwitchKobalte.Input class="sr-only" />
                <SwitchKobalte.Control
                    class={`
                    relative inline-flex w-10 h-6 items-center rounded-full
                    transition-colors duration-200
                    bg-gray-300 dark:bg-gray-700
                    data-[checked]:bg-blue-500 dark:data-[checked]:bg-blue-400
                    `}
                >
                    <SwitchKobalte.Thumb
                    class={`
                        absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white
                        transition-transform duration-200 transform
                        data-[checked]:translate-x-4
                    `}
                    />
                </SwitchKobalte.Control>
            </SwitchKobalte>
    )
}