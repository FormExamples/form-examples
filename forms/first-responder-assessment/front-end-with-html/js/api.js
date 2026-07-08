// Backend API client for the management dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns a `DashboardRespondersResponse`. When the fetch fails
// (CORS, network, server down) or returns an empty list, callers fall back
// to the sample data shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.FirstResponderAssessmentDashboard = window.FirstResponderAssessmentDashboard || {};

const API_BASE = 'http://localhost:5150';
const RESPONDERS_PATH = '/api/dashboard/responders';

/**
 * Fetch the responder list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').ResponderRow[]>}
 */
async function fetchResponders() {
  const res = await fetch(`${API_BASE}${RESPONDERS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch responders: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardRespondersResponse} */
  const data = await res.json();
  return data.items || [];
}

window.FirstResponderAssessmentDashboard.fetchResponders = fetchResponders;
window.FirstResponderAssessmentDashboard.API_BASE = API_BASE;
})();
