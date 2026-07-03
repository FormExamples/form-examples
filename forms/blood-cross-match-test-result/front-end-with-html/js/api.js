// Backend API client for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's data-loading contract. The backend lives
// at http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardReportsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.BloodCrossMatchTestResultDashboard =
  window.BloodCrossMatchTestResultDashboard || {};

const API_BASE = 'http://localhost:5150';
const REPORTS_PATH = '/api/dashboard/reports';

/**
 * Fetch the graded-report list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').ReportRow[]>}
 */
async function fetchReports() {
  const res = await fetch(`${API_BASE}${REPORTS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch reports: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardReportsResponse} */
  const data = await res.json();
  return data.items || [];
}

window.BloodCrossMatchTestResultDashboard.fetchReports = fetchReports;
window.BloodCrossMatchTestResultDashboard.API_BASE = API_BASE;
})();
