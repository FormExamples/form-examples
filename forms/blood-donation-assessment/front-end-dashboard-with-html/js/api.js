// Backend API client for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardDonorsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.BloodDonationAssessmentDashboard = window.BloodDonationAssessmentDashboard || {};

const API_BASE = 'http://localhost:5150';
const DONORS_PATH = '/api/dashboard/donors';

/**
 * Fetch the donor list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').DonorRow[]>}
 */
async function fetchDonors() {
  const res = await fetch(`${API_BASE}${DONORS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch donors: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardDonorsResponse} */
  const data = await res.json();
  return data.items || [];
}

window.BloodDonationAssessmentDashboard.fetchDonors = fetchDonors;
window.BloodDonationAssessmentDashboard.API_BASE = API_BASE;
})();
