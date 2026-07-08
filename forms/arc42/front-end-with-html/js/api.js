// Backend API client for the arc42 architecture dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `DashboardRow` objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.Arc42Dashboard =
  window.Arc42Dashboard || {};

const API_BASE = 'http://localhost:5150';
const DOCUMENTS_PATH = '/api/arc42_documentations';

/**
 * Fetch the document list from the backend.
 *
 * Resolves with the document array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to sample
 * data and surface a user-visible notice.
 *
 * Accepts both the bare-array shape (`DashboardRow[]`) and the
 * `{ items, total }` envelope so the dashboard is forwards-compatible with a
 * future paginated endpoint.
 *
 * @returns {Promise<import('./dashboard-types.js').DashboardRow[]>}
 */
async function fetchDocuments() {
  const res = await fetch(`${API_BASE}${DOCUMENTS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch documents: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardDocumentsResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

window.Arc42Dashboard.fetchDocuments = fetchDocuments;
window.Arc42Dashboard.API_BASE = API_BASE;
})();
