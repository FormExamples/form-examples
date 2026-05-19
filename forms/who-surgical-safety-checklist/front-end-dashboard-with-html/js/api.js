// Backend API client for the WHO Surgical Safety Checklist review
// dashboard. The backend lives at http://localhost:5150 (Loco / axum) and
// returns either a bare JSON array of `ChecklistRow` objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `sample-data.js` so the page is usable standalone.

(function () {
'use strict';
window.WhoSurgicalSafetyChecklistDashboard =
  window.WhoSurgicalSafetyChecklistDashboard || {};

const API_BASE = 'http://localhost:5150';
const CHECKLISTS_PATH = '/api/checklists';

/**
 * Fetch the checklist list from the backend.
 *
 * Resolves with the checklist array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * Accepts both the bare-array shape (`ChecklistRow[]`) and the
 * `{ items, total }` envelope so the dashboard is forwards-compatible with a
 * future paginated endpoint.
 *
 * @returns {Promise<import('./types.js').ChecklistRow[]>}
 */
async function fetchChecklists() {
  const res = await fetch(`${API_BASE}${CHECKLISTS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch checklists: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardChecklistsResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

window.WhoSurgicalSafetyChecklistDashboard.fetchChecklists = fetchChecklists;
window.WhoSurgicalSafetyChecklistDashboard.API_BASE = API_BASE;
})();
