// Backend API client for the return-to-work clinician dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `DashboardRow` objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.ReturnToWorkDashboard =
  window.ReturnToWorkDashboard || {};

const API_BASE = 'http://localhost:5150';
const RECORDS_PATH = '/api/return_to_works';

/**
 * Fetch the record list from the backend.
 *
 * Resolves with the row array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample
 * data and surface a user-visible notice.
 *
 * Accepts both the bare-array shape (`DashboardRow[]`) and the
 * `{ items, total }` envelope so the dashboard is forwards-compatible with a
 * future paginated endpoint.
 *
 * @returns {Promise<import('./dashboard-types.js').DashboardRow[]>}
 */
async function fetchRecords() {
  const res = await fetch(`${API_BASE}${RECORDS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch records: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

window.ReturnToWorkDashboard.fetchRecords = fetchRecords;
window.ReturnToWorkDashboard.API_BASE = API_BASE;
})();
