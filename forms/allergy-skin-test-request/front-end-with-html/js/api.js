// Backend API client for the allergy testing vetting dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `RequestRow` objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.AllergySkinTestRequestDashboard =
  window.AllergySkinTestRequestDashboard || {};

const API_BASE = 'http://localhost:5150';
const REQUESTS_PATH = '/api/requests';

/**
 * Fetch the request list from the backend.
 *
 * Resolves with the request array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to sample
 * data and surface a user-visible notice.
 *
 * Accepts both the bare-array shape (`RequestRow[]`) and the
 * `{ items, total }` envelope so the dashboard is forwards-compatible with a
 * future paginated endpoint.
 *
 * @returns {Promise<import('./types.js').RequestRow[]>}
 */
async function fetchRequests() {
  const res = await fetch(`${API_BASE}${REQUESTS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch requests: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardRequestsResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

window.AllergySkinTestRequestDashboard.fetchRequests = fetchRequests;
window.AllergySkinTestRequestDashboard.API_BASE = API_BASE;
})();
