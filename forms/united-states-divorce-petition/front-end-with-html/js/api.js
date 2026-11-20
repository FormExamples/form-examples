// Backend API client for the United States Divorce Petition dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Axum); the dashboard endpoint returns a
// `DashboardPetitionsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const PETITIONS_PATH = '/api/united-states-divorce-petition/dashboard/petitions';

/**
 * Fetch the petition list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').PetitionRow[]>}
 */
async function fetchPetitions() {
  const res = await fetch(`${API_BASE}${PETITIONS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch petitions: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardPetitionsResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchPetitions, API_BASE };
