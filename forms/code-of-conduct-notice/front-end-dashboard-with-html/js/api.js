// Backend API client for the compliance dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardStaffResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.CodeOfConductNoticeDashboard = window.CodeOfConductNoticeDashboard || {};

const API_BASE = 'http://localhost:5150';
const STAFF_PATH = '/api/dashboard/staff';

/**
 * Fetch the staff list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').StaffRow[]>}
 */
async function fetchStaff() {
  const res = await fetch(`${API_BASE}${STAFF_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch staff: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardStaffResponse} */
  const data = await res.json();
  return data.items || [];
}

window.CodeOfConductNoticeDashboard.fetchStaff = fetchStaff;
window.CodeOfConductNoticeDashboard.API_BASE = API_BASE;
})();
