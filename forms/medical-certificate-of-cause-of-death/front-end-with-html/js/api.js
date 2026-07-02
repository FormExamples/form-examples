// Backend API client for the Medical Certificate of Cause of Death (MCCD)
// certifier / medical-examiner dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardCertificatesResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.MedicalCertificateOfCauseOfDeathDashboard =
  window.MedicalCertificateOfCauseOfDeathDashboard || {};

const API_BASE = 'http://localhost:5150';
const CERTIFICATES_PATH = '/api/dashboard/certificates';

/**
 * Fetch the certificate list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').CertificateRow[]>}
 */
async function fetchCertificates() {
  const res = await fetch(`${API_BASE}${CERTIFICATES_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch certificates: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardCertificatesResponse} */
  const data = await res.json();
  return data.items || [];
}

window.MedicalCertificateOfCauseOfDeathDashboard.fetchCertificates = fetchCertificates;
window.MedicalCertificateOfCauseOfDeathDashboard.API_BASE = API_BASE;
})();
