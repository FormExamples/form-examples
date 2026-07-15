// Backend API client for the UK LP1F case dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum). The dashboard
// endpoint returns either a bare JSON array of DashboardRow objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone. The RESTful resource plural
// matches the SvelteKit route.

const API_BASE = 'http://localhost:5150';
const REQUESTS_PATH =
  '/api/united_kingdom_lasting_powers_of_attorney_for_financial_decisions';

/**
 * Fetch the LPA list from the backend.
 *
 * Resolves with the row array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice. Accepts both the bare-array shape and the
 * `{ items, total }` envelope so the dashboard is forwards-compatible with a
 * future paginated endpoint.
 *
 * @returns {Promise<import('./dashboard-types.js').DashboardRow[]>}
 */
async function fetchLpas() {
  const res = await fetch(`${API_BASE}${REQUESTS_PATH}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch LPAs: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export { fetchLpas, API_BASE };
