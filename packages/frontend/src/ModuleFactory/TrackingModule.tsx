import { createSignal } from "solid-js";
import { createDataTableModuleFactory } from "./DataTableModule.tsx";

type Event = {
    action: "sendEvent",
}

type ClickLinkEvent = Event &{
    eventName: "click.navigation",
    content: object,
    clickEventData: {
        label: string,
        clickType: "navigation",
        level1: string,
        level2: string,
        level3: string,
        selector: string,
    }
}

type ClickButtonEvent = Event &{
    eventName: "click.action",
    content: object,
    clickEventData: {
        label: string,
        clickType: "action",
        level1: string,
        level2: string,
        level3: string,
        selector: string,
    }
}

type PageDisplayEvent = Event &{
    eventName: "page.display",
    content: object,
}
type ObserveVisibleEvent = Event &{
    eventName: "observe.visible",
    content: object,
    observeEventData: {
        label: string,
        clickType: "action",
        level1: "Visibility",
        level2: string,
        level3: string,
        threshold: number,
        minTimeMilliseconds: number,
        selector: string,
    }
}

type TrackingEvent = ClickLinkEvent | ClickButtonEvent | PageDisplayEvent | ObserveVisibleEvent;

declare global {
    interface Window { dw_tracking_events?: any[]; }
}
const watch = function <T>(obj: T, prop: keyof T, handler: (newValue: T[keyof T]) => void) {
        let currentValue = obj[prop],
        getter = function () {
            return currentValue;
        },
        setter = function (val: T[keyof T]) {
            currentValue = val;
            return handler(val);
        };
        Object.defineProperty(obj, prop, {
            get: getter,
            set: setter,
        });
}

const watchFunctionCall = function <T extends object>(obj: T, prop: keyof T, handler: (...args: any[]) => void) {
    // eslint-disable-next-line
    const originalFn = (obj[prop] as Function).bind(obj);
    // @ts-ignore
    obj[prop] = (...args: any[]) => {
        originalFn(...args)
        handler(...args);
    }
}

export const TrackingModule = createDataTableModuleFactory<TrackingEvent>({
    getDataList: (() => {
        const [ dataList, setDataList ] = createSignal<TrackingEvent[]>([]);
        if(!window.dw_tracking_events){
            watch(window, 'dw_tracking_events', () => {
                // @ts-ignore
                setDataList(window.dw_tracking_events);
                // @ts-ignore
                watchFunctionCall(window.dw_tracking_events, 'push', () => {
                    // @ts-ignore
                    setDataList([...window.dw_tracking_events?.toReversed()]);
                })
            })
        } else {
            setDataList(window.dw_tracking_events);
            watchFunctionCall(window.dw_tracking_events, 'push', () => {
                // @ts-ignore
                    setDataList([...window.dw_tracking_events?.toReversed()]);
            })
        }
        return dataList;
    })(),
    columnNames: [
        'eventName',
        'label',
        'level1',
        'level2',
        'level3',
    ],
    columnDataFns: [
        (t) => t.eventName,
        // @ts-ignore
        (t) => t.clickEventData?.label,
        // @ts-ignore
        (t) => t.clickEventData?.level1,
        // @ts-ignore
        (t) => t.clickEventData?.level2,
        // @ts-ignore
        (t) => t.clickEventData?.level3,
    ],
    fieldFilter: 'eventName',
}, {
    title: 'Tracking',
})
