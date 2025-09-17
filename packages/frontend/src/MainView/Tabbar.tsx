import type { Component } from "solid-js"
import { ToggleButton, ToggleButtonGroup } from "@suid/material";
import { getCurrentModule, getModules, openSidePanel, setCurrentModule } from "../UIContext";

export const Tabbar: Component = () => {
    return (
        <div class="mr-auto h-full">
            <ToggleButtonGroup
                color="primary"
                value={getCurrentModule()?.title}
                exclusive
                onChange={(event, newModuleName) => {
                    // @ts-ignore
                    setCurrentModule(getModules().find(({ title}) => title === newModuleName) || getModules()[0]);
                    openSidePanel(false)
                }}
                >
                {
                    getModules().map(module => (
                    <ToggleButton
                        style={{
                            color: getCurrentModule()?.title === module.title ? '' :'var(--default-text)',
                            'border-color': 'var(--panel__border)',
                        }}
                        value={module.title}
                    >
                        {module.title}
                    </ToggleButton>
            ))
                }
            </ToggleButtonGroup>
    </div>
)}