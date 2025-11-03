import type { Component } from "solid-js"

export const OverlayOnElement: Component<{element:  HTMLElement}> = props => {
    return (
        <div style={{
            position: 'absolute',
            top: `${props.element.getBoundingClientRect().top + window.scrollY +2}px`,
            left: `${props.element.getBoundingClientRect().left +2}px`,
            width: `${props.element.getBoundingClientRect().width -4}px`,
            height: `${props.element.getBoundingClientRect().height -4}px`,
            background: 'rgba(68, 138, 218, 0.5)',
            'pointer-events': 'none',
            'z-index': 999,
        }}>
        </div>
    )
} 