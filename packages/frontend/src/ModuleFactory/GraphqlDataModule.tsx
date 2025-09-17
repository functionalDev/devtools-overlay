import { render } from "solid-js/web";
import type { ModuleFactory } from "./ModuleFactory.tsx";


export const GraphqlDataModule: ModuleFactory = () => {
    return {
        MainView: () => (
            <div style={{
                display: 'grid',
                "grid-template-columns": 'max-content 1fr',
                "align-items": 'center',
                gap: '5px',
                padding: '5px',
            }}>
            {/* 
            // @ts-expect-error typescript doesnt register web-component  from "@andypf/json-viewer" */}
            <andypf-json-viewer data={JSON.stringify({ a: 'asdfe'})}></andypf-json-viewer>
            </div>
        ),
        title: 'Graphql data',
        render
}
}