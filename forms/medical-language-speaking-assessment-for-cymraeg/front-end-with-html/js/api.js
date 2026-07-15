// Backend API client for the Welsh-language (Cymraeg) clinical speaking
// sub-test (Medicine) admin dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardCandidatesResponse`. When the fetch fails (CORS, network,
// server down) or returns an empty list, callers fall back to the sample
// data shipped in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const CANDIDATES_PATH = '/api/dashboard/candidates';

/**
 * Fetch the candidate list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').CandidateRow[]>}
 */
async function fetchCandidates() {
  const res = await fetch(`${API_BASE}${CANDIDATES_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch candidates: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardCandidatesResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchCandidates, API_BASE };
