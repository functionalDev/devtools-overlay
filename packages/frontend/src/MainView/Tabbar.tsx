import type { Component } from "solid-js"
import { useUIContext } from "../UIContext.tsx"
import { ToggleButton, ToggleButtonGroup } from "@suid/material";

export const Tabbar: Component = () => {
    const { getCurrentModule, setCurrentModule, openSidePanel, getModules } = useUIContext();
    const modules = getModules();
    return (
        <div class="mr-auto h-full">
            <ToggleButtonGroup
                color="primary"
                value={getCurrentModule()?.title}
                exclusive
                onChange={(event, newModuleName) => {
                    // @ts-ignore
                    setCurrentModule(modules.find(({ title}) => title === newModuleName) || modules[0]);
                    openSidePanel(false)
                }}
                >
                {
                    getModules().map(module => (
                    <ToggleButton
                        value={module.title}
                    >
                        {module.title}
                    </ToggleButton>
            ))
                }
            </ToggleButtonGroup>
    </div>
)}