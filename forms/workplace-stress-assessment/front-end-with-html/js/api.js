// Backend API client for the occupational health dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardTeamsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.WorkplaceStressAssessmentDashboard =
  window.WorkplaceStressAssessmentDashboard || {};

const API_BASE = 'http://localhost:5150';
const TEAMS_PATH = '/api/dashboard/teams';

/**
 * Fetch the team / department aggregate list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects
 * on any network error or non-2xx response so the caller can fall back
 * to sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').TeamRow[]>}
 */
async function fetchTeams() {
  const res = await fetch(`${API_BASE}${TEAMS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch teams: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardTeamsResponse} */
  const data = await res.json();
  return data.items || [];
}

window.WorkplaceStressAssessmentDashboard.fetchTeams = fetchTeams;
window.WorkplaceStressAssessmentDashboard.API_BASE = API_BASE;
})();
