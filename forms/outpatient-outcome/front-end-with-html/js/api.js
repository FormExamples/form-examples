// Backend API client for the outpatient outcome dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `OutcomeRow` objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const OUTCOMES_PATH = '/api/outpatient_outcomes';

/**
 * Fetch the outcome list from the backend.
 *
 * Resolves with the outcome array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * Accepts both the bare-array shape (`OutcomeRow[]`) and the `{ items, total }`
 * envelope so the dashboard is forwards-compatible with a future paginated
 * endpoint.
 *
 * @returns {Promise<import('./dashboard-types.js').OutcomeRow[]>}
 */
async function fetchOutcomes() {
  const res = await fetch(`${API_BASE}${OUTCOMES_PATH}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch outcomes: ${res.status} ${res.statusText}`);
  }
  /** @type {import('./dashboard-types.js').DashboardOutcomesResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export { fetchOutcomes, API_BASE };
