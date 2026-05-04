// Backend API client for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardAthletesResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.SportsMedicineAssessmentDashboard =
  window.SportsMedicineAssessmentDashboard || {};

const API_BASE = 'http://localhost:5150';
const ATHLETES_PATH = '/api/dashboard/athletes';

/**
 * Fetch the athlete list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').AthleteRow[]>}
 */
async function fetchAthletes() {
  const res = await fetch(`${API_BASE}${ATHLETES_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch athletes: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardAthletesResponse} */
  const data = await res.json();
  return data.items || [];
}

window.SportsMedicineAssessmentDashboard.fetchAthletes = fetchAthletes;
window.SportsMedicineAssessmentDashboard.API_BASE = API_BASE;
})();
