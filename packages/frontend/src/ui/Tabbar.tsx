import { type Component } from "solid-js"
import { getCurrentModule, getModules, openSidePanel, setCurrentModule } from "../UIContext";
import { Button } from "./Button";
import { PlaceholderIcon } from "../icons/PlaceholderIcon";

export const Tabbar: Component = () => {
    return (
        <div class="grid content-start mr-auto" style={{ height: '100%', overflow: 'auto', "scrollbar-width": 'none' }}>
            {
                getModules().map(module => (
                    <Button
                        size="s"
                        onClick={() => {
                            // @ts-ignore
                            setCurrentModule(getModules().find(({ title}) => title === module.title) || getModules()[0]);
                            openSidePanel(false)
                        }}
                        value={module.title}
                        variant={getCurrentModule()?.title === module.title ? 'primary' :'secondary'}
                        style={{
                            display:'grid',
                            'grid-template-rows': '1fr min-content',
                            "place-items": 'center',
                            "aspect-ratio": 1,
                            "max-width": '9ch',
                        }}
                    >
                        {module.Icon || <PlaceholderIcon  />}
                        <div style={{ "font-size": '0.8em'}}>
                            {module.title}
                        </div>
                    </Button>
                ))
            }
    </div>
)}