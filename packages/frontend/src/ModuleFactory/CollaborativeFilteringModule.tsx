import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import { render } from "solid-js/web";
import type { ModuleFactory } from "./ModuleFactory.tsx";
import { COLLAB_CONFIG } from "./collab-config.ts";

const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match?.[2] ? decodeURIComponent(match[2]) : null;
};

type CollabItem = { namedUrl: string; title: string; };

// Store original fetch for restoration
let originalFetch: typeof fetch | null = null;
let overrideClientId: string | null = null;

const setNestedValue = (obj: any, path: string, value: any): boolean => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]!;
        if (!current[key]) return false;
        current = current[key];
    }
    const lastKey = keys[keys.length - 1]!;
    if (current[lastKey] !== undefined) {
        current[lastKey] = value;
        return true;
    }
    return false;
};

const installFetchOverride = (clientId: string) => {
    if (!originalFetch) originalFetch = window.fetch;
    overrideClientId = clientId;
    window.fetch = async (input, init) => {
        if (overrideClientId && init?.body && typeof init.body === 'string') {
            try {
                const payload = JSON.parse(init.body) as any;
                if (setNestedValue(payload, COLLAB_CONFIG.trackingClientIdPath, overrideClientId)) {
                    init = { ...init, body: JSON.stringify(payload) };
                }
            } catch { /* not JSON, skip */ }
        }
        return originalFetch!(input, init);
    };
};

const removeFetchOverride = () => {
    if (originalFetch) {
        window.fetch = originalFetch;
        originalFetch = null;
    }
    overrideClientId = null;
};

export const CollaborativeFilteringModule: ModuleFactory = () => {
    const [inputId, setInputId] = createSignal('');
    const [activeId, setActiveId] = createSignal<string | null>(null);
    const [history, setHistory] = createSignal<CollabItem[]>([]);
    const [recommendations, setRecommendations] = createSignal<CollabItem[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [overrideEnabled, setOverrideEnabled] = createSignal(false);

    const fetchData = async (uid: string) => {
        setLoading(true);
        setError(null);
        setActiveId(uid);
        try {
            const base = `${location.origin}${COLLAB_CONFIG.apiBasePath}`;
            const recsParams = COLLAB_CONFIG.recsParams ? `&${COLLAB_CONFIG.recsParams}` : '';
            const [histRes, recRes] = await Promise.all([
                fetch(`${base}${COLLAB_CONFIG.historyEndpoint}?user_id=${encodeURIComponent(uid)}`),
                fetch(`${base}${COLLAB_CONFIG.recsEndpoint}?user_id=${encodeURIComponent(uid)}${recsParams}`)
            ]);
            if (!histRes.ok || !recRes.ok) throw new Error('Fetch failed');
            const [histData, recData] = await Promise.all([histRes.json(), recRes.json()]) as [any, any];
            setHistory(histData.data?.peachExperimentContents || histData.data?.userHistory || []);
            setRecommendations(recData.data?.peachExperimentContents || []);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to fetch');
        } finally {
            setLoading(false);
        }
    };

    onMount(() => {
        const cookie = getCookie(COLLAB_CONFIG.cookieName);
        if (cookie) setInputId(cookie);
    });

    onCleanup(() => {
        removeFetchOverride();
    });

    const handleFetch = () => {
        const uid = inputId().trim();
        if (uid) fetchData(uid);
    };

    const toggleOverride = (enabled: boolean) => {
        setOverrideEnabled(enabled);
        if (enabled && inputId().trim()) {
            installFetchOverride(inputId().trim());
        } else {
            removeFetchOverride();
        }
    };

    const ItemList = (props: { items: CollabItem[] }) => (
        <ul style={{ "list-style": 'none', padding: 0, margin: 0 }}>
            <For each={props.items}>
                {(item) => (
                    <li style={{ "margin-bottom": '8px' }}>
                        <a href={item.namedUrl} target="_blank" style={{ color: '#0066cc', "text-decoration": 'none', "font-size": '12px' }}>
                            {item.title}
                        </a>
                    </li>
                )}
            </For>
        </ul>
    );

    return {
        title: 'Collaborative Filtering',
        MainView: () => (
            <div style={{ padding: '8px' }}>
                {/* Header */}
                <div style={{ "margin-bottom": '12px', "border-bottom": '1px solid #ddd', "padding-bottom": '8px' }}>
                    <div style={{ "margin-bottom": '8px' }}>
                        <input
                            type="text"
                            value={inputId()}
                            onInput={(e) => setInputId(e.currentTarget.value)}
                            placeholder="Enter User ID"
                            style={{ "margin-right": '8px', padding: '4px', width: '200px' }}
                        />
                        <button onClick={handleFetch} disabled={loading() || !inputId().trim()}>
                            {loading() ? 'Loading...' : 'Get History and Recommendations'}
                        </button>
                    </div>
                    <label style={{ display: 'flex', "align-items": 'center', gap: '6px', "font-size": '12px' }}>
                        <input
                            type="checkbox"
                            checked={overrideEnabled()}
                            onChange={(e) => toggleOverride(e.currentTarget.checked)}
                            disabled={!inputId().trim()}
                        />
                        Override tracking client.id with this User ID
                        <Show when={overrideEnabled()}>
                            <span style={{ color: 'green' }}>✓ Active</span>
                        </Show>
                    </label>
                    <Show when={activeId()}>
                        <p style={{ "font-size": '12px', color: '#666', margin: '8px 0 0' }}>Active ID: {activeId()}</p>
                    </Show>
                </div>

                <Show when={error()}><p style={{ color: 'red' }}>{error()}</p></Show>

                <Show when={activeId() && !loading()}>
                    {/* Two column layout */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 8px', "font-size": '13px' }}>User History</h4>
                            <Show when={history().length > 0} fallback={<p style={{ "font-size": '12px' }}>No history</p>}>
                                <ItemList items={history()} />
                            </Show>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 8px', "font-size": '13px' }}>Recommendations</h4>
                            <Show when={recommendations().length > 0} fallback={<p style={{ "font-size": '12px' }}>No recommendations</p>}>
                                <ItemList items={recommendations()} />
                            </Show>
                        </div>
                    </div>
                </Show>
            </div>
        ),
        SidePanel: () => <div>Details</div>,
        render,
    };
};
