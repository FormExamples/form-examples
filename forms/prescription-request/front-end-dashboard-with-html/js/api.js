// Backend API client for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardPrescriptionsResponse`. When the fetch fails (CORS, network,
// server down) or returns an empty list, callers fall back to the sample
// data shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.PrescriptionRequestDashboard = window.PrescriptionRequestDashboard || {};

const API_BASE = 'http://localhost:5150';
const PRESCRIPTIONS_PATH = '/api/dashboard/prescriptions';

/**
 * Fetch the prescription-request list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').PrescriptionRow[]>}
 */
async function fetchPrescriptions() {
  const res = await fetch(`${API_BASE}${PRESCRIPTIONS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch prescriptions: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardPrescriptionsResponse} */
  const data = await res.json();
  return data.items || [];
}

window.PrescriptionRequestDashboard.fetchPrescriptions = fetchPrescriptions;
window.PrescriptionRequestDashboard.API_BASE = API_BASE;
})();
