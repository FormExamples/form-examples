// Backend API client for the UK DVLA V1 clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardPatientsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.DvlaV1Dashboard = window.DvlaV1Dashboard || {};

const API_BASE = 'http://localhost:5150';
const PATIENTS_PATH = '/api/dashboard/patients';

/**
 * Fetch the applicant list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').PatientRow[]>}
 */
async function fetchPatients() {
  const res = await fetch(`${API_BASE}${PATIENTS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch patients: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardPatientsResponse} */
  const data = await res.json();
  return data.items || [];
}

window.DvlaV1Dashboard.fetchPatients = fetchPatients;
window.DvlaV1Dashboard.API_BASE = API_BASE;
})();
