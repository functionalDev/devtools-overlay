import { createSignal, type Component } from "solid-js";
import { Button, type ButtonProps } from "./Button";

export const ToggleButton: Component<{ initialValue?: boolean, onOn?: () => void, onOff?: () => void } & ButtonProps> = props => {
    const [isOn, setToggle] = createSignal(props.initialValue ||false);
    const toggle = () => {
        isOn() ? props.onOff?.(): props.onOn?.(); 
        setToggle(s=> !s);
    }
    return (
        <Button variant={isOn() ? "primary": "secondary"} onClick={toggle} {...props} class={`${props.class ?? ""}`}/>
    )
}