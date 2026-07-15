// Backend API client for the cardiology response interpretation dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `ResponseRow` objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const RESPONSES_PATH = '/api/cardiology_responses';

/**
 * Fetch the response list from the backend.
 *
 * Resolves with the response array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to sample
 * data and surface a user-visible notice.
 *
 * Accepts both the bare-array shape (`ResponseRow[]`) and the
 * `{ items, total }` envelope so the dashboard is forwards-compatible with a
 * future paginated endpoint.
 *
 * @returns {Promise<import('./dashboard-types.js').ResponseRow[]>}
 */
async function fetchResponses() {
  const res = await fetch(`${API_BASE}${RESPONSES_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch responses: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardResponsesResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export { fetchResponses, API_BASE };
