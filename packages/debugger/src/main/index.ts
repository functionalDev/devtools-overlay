import * as s from 'solid-js'
import {createStaticStore} from '@solid-primitives/static-store'
import {defer} from '@solid-primitives/utils'
import {assert, log_message, msg, mutate_remove, type Timeout} from '@solid-devtools/shared/utils'
import {createDependencyGraph} from '../dependency/index.ts'
import {createInspector} from '../inspector/index.ts'
import {createLocator} from '../locator/index.ts'
import {createStructure} from '../structure/index.ts'
import * as walker from '../structure/walker.ts'
import {getObjectById, getSdtId, ObjectType} from './id.ts'
import {initRoots} from './roots.ts'
import setup from './setup.ts'
import {
    DebuggerModule,
    DEFAULT_MAIN_VIEW, DevtoolsMainView,
    INSPECTED_STATE_NULL, type InspectedState,
    type InputChannels,
    type InputMessage,
    type NodeID,
    type OutputListener,
    type OutputMessage,
    type DebuggerOptions,
} from './types.ts'

function createDebugger<TEl extends object>(
    options?: DebuggerOptions<TEl>,
) {
    assert(globalThis.SolidDevtools$$, 'solid-devtools is not setup')

    if (options != null) {
        globalThis.SolidDevtools$$.debugger_options = options
    }

    initRoots()

    const _output_listeners: OutputListener[] = []
    
    function listen(listener: OutputListener): (() => void) {
        _output_listeners.push(listener)
        return () => mutate_remove(_output_listeners, listener)
    }
    
    function emitOutput(e: OutputMessage) {
    
        DEV: {log_message('Client', 'Debugger', e)}
    
        for (let fn of _output_listeners) fn(e)
    }
    
    //
    // Debugger Enabled
    //
    const [modules, toggleModules] = createStaticStore({
        debugger: false,
        locator:  false,
        dgraph:   false,
        locatorKeyPressSignal: (): boolean => false,
    })
    
    // The debugger can be enabled by devtools or by the locator
    const debuggerEnabled = s.createMemo(
        () => modules.debugger || modules.locatorKeyPressSignal()
    )
    const dgraphEnabled = s.createMemo(
        () => modules.dgraph && debuggerEnabled()
    )
    // locator is enabled if debugger is enabled, and user pressed the key to activate it, or the plugin activated it
    const locatorEnabled = s.createMemo(
        () => (modules.locatorKeyPressSignal() || modules.locator) && debuggerEnabled(),
    )
    
    s.createEffect(defer(debuggerEnabled, enabled => {
        emitOutput(msg('DebuggerEnabled', enabled))
    }))
    
    //
    // Current Open VIEW (currently not used)
    //
    let currentView: DevtoolsMainView = DEFAULT_MAIN_VIEW
    
    //
    // Enabled Modules
    //
    function toggleModule(data: InputChannels['ToggleModule']): void {
        switch (data.module) {
            case DebuggerModule.Structure:
                // * Structure is always enabled
                break
            case DebuggerModule.Dgraph:
                toggleModules('dgraph', data.enabled)
                break
            case DebuggerModule.Locator:
                toggleModules('locator', data.enabled)
                break
        }
    }
    
    //
    // Inspected Node
    //
    
    // Current inspected node is shared between modules
    const [inspectedState, setInspectedState] = s.createSignal<InspectedState>(
        INSPECTED_STATE_NULL,
        {equals: false},
    )
    
    s.createEffect(() => {
        emitOutput(msg('InspectedState', inspectedState()))
    })
    
    function getTreeWalkerOwnerId(ownerId: NodeID | null): NodeID | null {
        const owner = ownerId && getObjectById(ownerId, ObjectType.Owner)
        const treeWalkerOwner = owner && structure.getClosestIncludedOwner(owner)
        return treeWalkerOwner ? getSdtId(treeWalkerOwner, ObjectType.Owner) : null
    }
    
    function setInspectedNode(data: InputChannels['InspectNode']): void {
        if (data == null) {
            setInspectedState(INSPECTED_STATE_NULL)
        } else {
            let ownerId  = data.ownerId  && getObjectById(data.ownerId,  ObjectType.Owner)  && data.ownerId
            let signalId = data.signalId && getObjectById(data.signalId, ObjectType.Signal) && data.signalId
            let treeWalkerOwnerId = getTreeWalkerOwnerId(ownerId)
            setInspectedState({ownerId, signalId, treeWalkerOwnerId})
        }
    }
    
    s.createComputed(defer(debuggerEnabled, enabled => {
        if (!enabled) setInspectedState(INSPECTED_STATE_NULL)
    }))
    
    // Computation and signal updates
    let node_updates_ids: NodeID[] = []
    let node_updates_timeout = null as null | Timeout
    
    function pushNodeUpdate(id: NodeID) {
        
        node_updates_ids.push(id)
        
        if (node_updates_timeout == null) {
            node_updates_timeout = setTimeout(() => {
                emitOutput(msg('NodeUpdates', node_updates_ids))
                node_updates_ids     = []
                node_updates_timeout = null
            })
        }
    }

    let component_registry = walker.makeComponentRegistry(setup.debugger_options.eli)
    
    //
    // Structure:
    //
    const structure = createStructure({
        onStructureUpdate(updates) {
            emitOutput(msg('StructureUpdates', updates))
            /** Check if the inspected node doesn't need to change */
            setInspectedState(p => ({
                ...p,
                treeWalkerOwnerId: getTreeWalkerOwnerId(p.treeWalkerOwnerId),
            }))
        },
        onNodeUpdate: pushNodeUpdate,
        enabled: debuggerEnabled,
        component_registry: component_registry,
    })
    
    //
    // Inspected Owner details:
    //
    const inspector = createInspector({
        enabled:            debuggerEnabled,
        inspectedState:     inspectedState,
        resetInspectedNode: () => setInspectedState(INSPECTED_STATE_NULL),
        emit:               emitOutput,
    })
    
    //
    // Dependency Graph
    //
    const dgraph = createDependencyGraph({
        enabled:        dgraphEnabled,
        onNodeUpdate:   pushNodeUpdate,
        inspectedState: inspectedState,
        emit:           emitOutput,
    })
    
    //
    // Locator
    //
    const locator = createLocator({
        locatorEnabled,
        setLocatorEnabledSignal(signal) {
            toggleModules('locatorKeyPressSignal', () => signal)
        },
        onComponentClick(componentId, next) {
            if (modules.debugger) {
                emitOutput(msg('InspectedComponent', componentId))
            } else {
                next()
            }
        },
        emit: emitOutput,
        component_registry: component_registry,
    })
    
    // Opens the source code of the inspected component
    function openInspectedNodeLocation() {
        const details = inspector.getLastDetails()
        details?.location && locator.openElementSourceCode(details.location)
    }
    
    // send the state of the client locator mode
    s.createEffect(defer(modules.locatorKeyPressSignal, state => {
        emitOutput(msg('LocatorModeChange', state))
    }))
    
    function emitInput(e: InputMessage) {
    
        DEV: {log_message('Debugger', 'Client', e)}
    
        switch (e.kind) {
        case 'ResetState': {
            // reset all the internal state
            s.batch(() => {
                setInspectedState(INSPECTED_STATE_NULL)
                currentView = DEFAULT_MAIN_VIEW
                structure.resetTreeWalkerMode()
                locator.setDevtoolsHighlightTarget(null)
            })
            break
        }
        case 'HighlightElementChange':
            locator.setDevtoolsHighlightTarget(e.data)
            break
        case 'InspectNode':
            setInspectedNode(e.data)
            break
        case 'InspectValue':
            inspector.toggleValueNode(e.data)
            break
        case 'ConsoleInspectValue':
            inspector.consoleLogValue(e.data)
            break
        case 'OpenLocation':
            openInspectedNodeLocation()
            break
        case 'TreeViewModeChange':
            structure.setTreeWalkerMode(e.data)
            break
        case 'ViewChange':
            currentView = e.data
            structure.onViewChange(currentView)
            dgraph.onViewChange(currentView)
            break
        case 'ToggleModule':
            toggleModule(e.data)
            break
        }
    }

    return {
        versions:          setup.versions,
        enabled:           debuggerEnabled,
        listen:            listen,
        emit:              emitInput,
        setLocatorOptions: locator.useLocator,
        toggleEnabled(enabled: boolean) {
            toggleModules('debugger', enabled)
        },
    }
}

export type Debugger = ReturnType<typeof createDebugger>
let _debugger_instance: Debugger | undefined

/**
 * Used for connecting debugger to devtools
 */
export function useDebugger<TEl extends object>(
    options?: DebuggerOptions<TEl>,
): Debugger {
    _debugger_instance ??= createDebugger(options)
    return _debugger_instance
}
