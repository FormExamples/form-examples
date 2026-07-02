// Backend API client for the recovery-team dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardRecordsResponse`. When the fetch fails (CORS, network, server down)
// or returns an empty list, callers fall back to the sample data shipped in
// `data.js` so the page is usable standalone.

(function () {
'use strict';
window.PostAnaesthesiaCareUnitRecordDashboard =
  window.PostAnaesthesiaCareUnitRecordDashboard || {};

const API_BASE = 'http://localhost:5150';
const RECORDS_PATH = '/api/dashboard/records';

/**
 * Fetch the recovery-record list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').RecordRow[]>}
 */
async function fetchRecords() {
  const res = await fetch(`${API_BASE}${RECORDS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch records: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardRecordsResponse} */
  const data = await res.json();
  return data.items || [];
}

window.PostAnaesthesiaCareUnitRecordDashboard.fetchRecords = fetchRecords;
window.PostAnaesthesiaCareUnitRecordDashboard.API_BASE = API_BASE;
})();
