import { render } from "solid-js/web";
// import { GraphqlDataModule } from "./GraphqlDataModule.tsx";
import { ModesModule } from "./ModesModule.tsx";
import { type Module, type ModuleFactory } from "./ModuleFactory.tsx";
import { TrackingModule } from "./TrackingModule.tsx";
import { VisibilityModule } from "./VisibilityModule.tsx";
import { CopyTemplateModule } from "./CopyTemplateModule/index.tsx";
import { createResource, createSignal, For, Show } from "solid-js";
import { Input } from "../ui/Input.tsx";

function getCookie(name: string) {
  return new URLSearchParams(document.cookie.replace(/; /g, "&")).get(name);
}
function setCookie(name: string, value: string, days?: number) {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/`;

  if (days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    cookie += `; expires=${expires}`;
  }

  document.cookie = cookie;
}

const ourModule: ModuleFactory = () => {
    const [userId, setUserId] = createSignal(getCookie('_pc_c') || '');
    const handleUserIdChange = (e: Event) => {
        const newUserId = (e.target as HTMLInputElement).value;
        setCookie('_pc_c', newUserId);
        setUserId(newUserId);
    }

    const getHistory = (user: string | null) => {
        if(user){
            return fetch('/graphql', {
                "headers": {
                    // "accept": "application/graphql-response+json, application/json, multipart/mixed",
                    // "accept-language": "en,en-US;q=0.9,sv;q=0.8",
                    // "cache-control": "no-cache",
                    "content-type": "application/json",
                },
                "body": `{\"query\":\"{peachExperimentContents(amount:50 lang:ENGLISH peachPath:\\\"user_history\\\" filters:[{field:\\\"user_id\\\" value:\\\"${user}\\\"}]){...on ModelAspect{modelType}...on NamedAspect{title}}}\",\"extensions\":{}}`,
                "method": "POST",
                // "mode": "cors",
                // "credentials": "include"
            })
            .then(response => response.json())
            .then((response: any) => {
                        const newHistory = response.data?.peachExperimentContents as any[];
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        return newHistory || [];
            });
        } 
        return Promise.resolve([]);
    }

    const [history] = createResource(userId, getHistory);
    return {
        title: 'Peach user',
        MainView: () => 
            <>
            <div class="flex gap-10">
                <label class="text-sm self-center ">user_id</label>
                <Input class="w-fit text-lg inline-block py2 px2" onChange={handleUserIdChange} value={userId()}/>
            </div>
            <div class="p-5 grid auto-cols-[max-content] gap-x-10 gap-y-1">
                <Show when={!history.loading && !history.error && history() }>

                    <For each={Object.keys(history()?.[0] || {})}>{
                        (columnName, index) => <div style={{ '--col':  index() + 1 }} class="b-bottom-1 b-white col-start-[--col]">{columnName}</div>    
                    }</For>
                    <hr class="col-span-2 w-full m-0"/>
                    <For each={history()}>{
                        (row) => 
                            <For each={Object.values(row)}>{
                                (cell, index) => <div style={{ '--col':  index() + 1 }} class="col-start-[--col]">{cell as string}</div>    
                            }</For>   
                        }</For>
                </Show>
                
            </div>
            </>
        ,
        SidePanel: () => 'sidepanel',
        render,
    }
}
// const searchModule: ModuleFactory = () => {
    
//     const [userId, setUserId] = createSignal(getCookie('_pc_c'));

//     return {
//         title: 'Search endpoints',
//         MainView: () => 
//             <>
//                 <input value={userId()}>{userId()} + 1123213</input>
//             </>
//         ,
//         SidePanel: () => 'sidepanel',
//         render,
//     }
// }

export const exampleModules: Module[] = [
    ModesModule(),
    TrackingModule(),
    VisibilityModule(),
    CopyTemplateModule(),
    ourModule(),
    // searchModule(),
    // GraphqlDataModule(),
    // {
    //     connector: {
    //         initFn: () => ({
    //             'some context': 'value',
    //         })
    //     },
    //     MainView: ({ openSidePanel }) => (
    //     <div>test22
    //         <button onClick={() => openSidePanel((b) => !b)}>
    //             toggleSidepanel33
    //         </button>
    //     </div>
    //     ),
    //     SidePanel: () => <div>side22</div>,
    //     title: 'Recommendations',
    //     render,
    // },
    // {
    //     connector: {
    //         initFn: () => ({
    //             'some context': 'value',
    //         })
    //     },
    //     MainView: ({ openSidePanel }) => (
    //     <div>test22
    //         <button onClick={() => openSidePanel((b) => !b)}>
    //             toggleSidepanel33
    //         </button>
    //     </div>
    //     ),
    //     SidePanel: () => <div>side22</div>,
    //     title: 'CrUX',
    //     render,
    // },
    // {
    //     connector: {
    //         initFn: () => ({
    //             'some context': 'value',
    //         })
    //     },
    //     MainView: ({ openSidePanel }) => (
    //     <div>test22
    //         <button onClick={() => openSidePanel((b) => !b)}>
    //             toggleSidepanel33
    //         </button>
    //     </div>
    //     ),
    //     SidePanel: () => <div>side22</div>,
    //     title: 'CVW',
    //     render,
    // },
    // {
    //     connector: {
    //         initFn: () => ({
    //             'some context': 'value',
    //         })
    //     },
    //     MainView: ({ openSidePanel }) => (
    //     <div>test22
    //         <button onClick={() => openSidePanel((b) => !b)}>
    //             toggleSidepanel33
    //         </button>
    //     </div>
    //     ),
    //     SidePanel: () => <div>side22</div>,
    //     title: 'CoCo',
    //     render,
    // },
    // connector: {
    //     initFn: () => ({
    //         'some context': 'value',
    //     })
    // },
    // (() => {
    //     const [entryClicked, setEntryClicked] = createSignal(null);
    //     const onClickHandler = (e) => {
    //         const text = e.target.textContent;
    //         setEntryClicked(text);
    //     }
    //     return {
    //         MainView: ({ openSidePanel }) => (
    //             <ul>
    //                 <li onClick={(e) => onClickHandler(e) || openSidePanel(s => !s)}>most viewed</li>
    //                 <li onClick={onClickHandler}>least viewed</li>
    //                 <li onClick={onClickHandler}>decently viewed</li>
    //                 <li onClick={onClickHandler}>hardly viewed</li>
    //                 <li onClick={onClickHandler}>softly viewed</li>
    //                 <li onClick={onClickHandler}>accidentally</li>
    //             </ul>
    //         ),
    //         SidePanel: () => <div>{entryClicked()}</div>,
    //         title: 'PEACH links',
    //         render,
    //     } as Module
    // })(),
]
