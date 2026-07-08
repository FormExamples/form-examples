// Backend API client for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardPatientsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.ConsentToTreatmentDashboard = window.ConsentToTreatmentDashboard || {};

const API_BASE = 'http://localhost:5150';
const PATIENTS_PATH = '/api/dashboard/patients';

/**
 * Fetch the patient list from the backend.
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

window.ConsentToTreatmentDashboard.fetchPatients = fetchPatients;
window.ConsentToTreatmentDashboard.API_BASE = API_BASE;
})();
