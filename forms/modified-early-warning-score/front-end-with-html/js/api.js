// Backend API client for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardObservationsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.ModifiedEarlyWarningScoreDashboard =
  window.ModifiedEarlyWarningScoreDashboard || {};

const API_BASE = 'http://localhost:5150';
const OBSERVATIONS_PATH = '/api/dashboard/observations';

/**
 * Fetch the observation list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').ObservationRow[]>}
 */
async function fetchObservations() {
  const res = await fetch(`${API_BASE}${OBSERVATIONS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch observations: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardObservationsResponse} */
  const data = await res.json();
  return data.items || [];
}

window.ModifiedEarlyWarningScoreDashboard.fetchObservations = fetchObservations;
window.ModifiedEarlyWarningScoreDashboard.API_BASE = API_BASE;
})();
