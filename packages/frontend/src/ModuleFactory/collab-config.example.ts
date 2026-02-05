// Example configuration - copy to collab-config.ts and fill in your values

export const COLLAB_CONFIG = {
    /** Cookie name containing the user ID */
    cookieName: 'your_cookie_name',
    /** API base path (relative to origin) */
    apiBasePath: '/api/path',
    /** User history endpoint */
    historyEndpoint: '/history',
    /** Recommendations endpoint */
    recsEndpoint: '/recommendations',
    /** Additional query params for recommendations */
    recsParams: '',
    /** Tracking payload path to override (dot notation) */
    trackingClientIdPath: 'client.id',
};
