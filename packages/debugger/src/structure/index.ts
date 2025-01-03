import {throttle} from '@solid-primitives/scheduled'
import * as registry from '../main/component-registry.ts'
import {DEFAULT_WALKER_MODE, DevtoolsMainView, NodeType, TreeWalkerMode} from '../main/constants.ts'
import {ObjectType, getSdtId} from '../main/id.ts'
import * as roots from '../main/roots.ts'
import {type Mapped, type NodeID, type Solid} from '../main/types.ts'
import {isDisposed, markOwnerType} from '../main/utils.ts'
import {type ComputationUpdateHandler, walkSolidTree} from './walker.ts'

export type StructureUpdates = {
    /** Partial means that the updates are based on the previous structure state */
    partial: boolean
    /** Removed roots */
    removed: NodeID[]
    /** Record: `rootId` -- Record of updated nodes by `nodeId` */
    updated: Partial<Record<NodeID, Partial<Record<NodeID, Mapped.Owner>>>>
}

/**
 * Finds the closest owner of a given owner that is included in the tree walker.
 */
// TODO unit test this
function getClosestIncludedOwner(owner: Solid.Owner, mode: TreeWalkerMode): Solid.Owner | null {
    // 1. make sure the tree is not disposed
    // if it is, find the non-disposed owner and use as the owner
    let closest: Solid.Owner | null = null
    let current: Solid.Owner | null = owner
    do {
        if (isDisposed(current)) closest = current.owner
        current = current.owner
    } while (current)
    owner = closest ?? owner

    // 2. find the closest owner that is included in the tree walker
    if (mode === TreeWalkerMode.Owners) return owner
    let root: Solid.Owner | null = null
    do {
        const type = markOwnerType(owner)
        if (type === NodeType.Component || type === NodeType.Context) return owner
        if (type === NodeType.Root) root = owner
        owner = owner.owner!
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } while (owner)
    return root
}

export function createStructure(props: {
    onStructureUpdate: (updates: StructureUpdates) => void
    onNodeUpdate:      (nodeId: NodeID) => void
    enabled:           () => boolean
}) {

    let treeWalkerMode: TreeWalkerMode = DEFAULT_WALKER_MODE

    const updateQueue = new Set<Solid.Owner>()
    /** root ids correcponding to owners in the update queue */
    const ownerRoots = new Map<Solid.Owner, NodeID>()
    const removedRoots = new Set<NodeID>()
    let shouldUpdateAllRoots = true

    const onComputationUpdate: ComputationUpdateHandler = (
        rootId, owner, changedStructure,
    ) => {
        // separate the callback from the computation
        queueMicrotask(() => {
            if (!props.enabled()) return
            if (changedStructure) {
                updateOwner(owner, rootId)
            }
            let id = getSdtId(owner, ObjectType.Owner)
            props.onNodeUpdate(id)
        })
    }

    function forceFlushRootUpdateQueue(): void {
        
        if (props.enabled()) {
            const updated: StructureUpdates['updated'] = {}

            const partial = !shouldUpdateAllRoots
            shouldUpdateAllRoots = false

            const [owners, getRootId] = partial
                ? [updateQueue, (owner: Solid.Owner) => ownerRoots.get(owner)!]
                : [
                      roots.getCurrentRoots(),
                      (owner: Solid.Owner) => getSdtId(owner, ObjectType.Owner),
                  ]

            for (const owner of owners) {
                const rootId = getRootId(owner)
                const tree = walkSolidTree(owner, {
                    rootId,
                    mode: treeWalkerMode,
                    onComputationUpdate,
                    registerComponent: registry.registerComponent,
                })
                const map = updated[rootId]
                if (map) map[tree.id] = tree
                else updated[rootId] = {[tree.id]: tree}
            }

            if (!partial) {
                updated['#unowned'] = {
                    ['#unowned']: {
                        id:       '#unowned',
                        name:     'UNOWNED',
                        type:     NodeType.Root,
                        children: [],
                    }
                }
            }

            props.onStructureUpdate({partial, updated, removed: [...removedRoots]})
        }
        updateQueue.clear()
        flushRootUpdateQueue.clear()
        removedRoots.clear()
        ownerRoots.clear()
    }
    const flushRootUpdateQueue = throttle(forceFlushRootUpdateQueue, 250)

    function updateOwner(node: Solid.Owner, topRootId: NodeID): void {
        updateQueue.add(node)
        ownerRoots.set(node, topRootId)
        flushRootUpdateQueue()
    }

    roots.setOnOwnerNeedsUpdate((node: Solid.Owner, topRootId: NodeID) => {
        const closestIncludedOwner = getClosestIncludedOwner(node, treeWalkerMode)
        closestIncludedOwner && updateOwner(closestIncludedOwner, topRootId)
    })

    roots.setOnRootRemoved((rootId: NodeID) => {
        removedRoots.add(rootId)
        flushRootUpdateQueue()
    })

    function updateAllRoots(): void {
        shouldUpdateAllRoots = true
        flushRootUpdateQueue()
    }

    function forceUpdateAllRoots(): void {
        shouldUpdateAllRoots = true
        queueMicrotask(forceFlushRootUpdateQueue)
    }

    function setTreeWalkerMode(mode: TreeWalkerMode): void {
        treeWalkerMode = mode
        updateAllRoots()
        registry.clearComponentRegistry()
    }

    return {
        updateAllRoots,
        forceUpdateAllRoots,
        setTreeWalkerMode,
        resetTreeWalkerMode: () => setTreeWalkerMode(DEFAULT_WALKER_MODE),
        getClosestIncludedOwner(owner: Solid.Owner) {
            return getClosestIncludedOwner(owner, treeWalkerMode)
        },
        onViewChange(view: DevtoolsMainView) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (view === DevtoolsMainView.Structure) {
                updateAllRoots()
            }
        },
    }
}
