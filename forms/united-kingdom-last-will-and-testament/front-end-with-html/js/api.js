// Backend API client for the United Kingdom Last Will and Testament
// wills dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Axum / axum); the dashboard endpoint returns a
// `DashboardWillsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const WILLS_PATH = '/api/dashboard/wills';

/**
 * Fetch the will list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').WillRow[]>}
 */
async function fetchWills() {
  const res = await fetch(`${API_BASE}${WILLS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch wills: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardWillsResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchWills, API_BASE };
