// Backend API client for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardIncidentsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const INCIDENTS_PATH = '/api/dashboard/incidents';

/**
 * Fetch the incident list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').IncidentRow[]>}
 */
async function fetchIncidents() {
  const res = await fetch(`${API_BASE}${INCIDENTS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch incidents: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardIncidentsResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchIncidents, API_BASE };
