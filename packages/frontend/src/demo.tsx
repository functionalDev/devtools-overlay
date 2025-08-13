import { render } from "solid-js/web";
import { createDevtools } from "./controller.tsx";
import 'virtual:uno.css';

const Main = () => {
    const devTools = createDevtools({
        headerSubtitle: () => 'overlay',
    });
    return <devTools.Devtools></devTools.Devtools>
}

render(() => <Main/>, document.getElementById('root')!)