import { render } from "solid-js/web";
import { Devtools } from "./controller.tsx";
import 'virtual:uno.css';
import { exampleModules } from "./ModuleFactory/exampleModules.tsx";

const Main = () => {
    return <Devtools modules={exampleModules}></Devtools>
}

render(() => <Main/>, document.getElementById('root')!)