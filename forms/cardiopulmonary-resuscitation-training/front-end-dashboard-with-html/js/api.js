// Backend API client for the training coordinator dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardTraineesResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.CardiopulmonaryResuscitationTrainingDashboard =
  window.CardiopulmonaryResuscitationTrainingDashboard || {};

const API_BASE = 'http://localhost:5150';
const TRAINEES_PATH = '/api/dashboard/trainees';

/**
 * Fetch the trainee list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').TraineeRow[]>}
 */
async function fetchTrainees() {
  const res = await fetch(`${API_BASE}${TRAINEES_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch trainees: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardTraineesResponse} */
  const data = await res.json();
  return data.items || [];
}

window.CardiopulmonaryResuscitationTrainingDashboard.fetchTrainees =
  fetchTrainees;
window.CardiopulmonaryResuscitationTrainingDashboard.API_BASE = API_BASE;
})();
