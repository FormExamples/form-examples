// Backend API client for the theatre dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api/operationNotes.ts`. The
// backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `OperationNoteRow` objects
// or a `{ items, total }` envelope. When the fetch fails (CORS, network,
// server down) or returns an empty list, callers fall back to the sample
// data shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.MedicalOperationNoteDashboard =
  window.MedicalOperationNoteDashboard || {};

const API_BASE = 'http://localhost:5150';
const OPERATION_NOTES_PATH = '/api/operation-notes';

/**
 * Fetch the operation-note list from the backend.
 *
 * Resolves with the operation-note array on a successful 2xx response.
 * Rejects on any network error or non-2xx response so the caller can fall
 * back to sample data and surface a user-visible notice.
 *
 * Accepts both the bare-array shape (`OperationNoteRow[]`) and the
 * `{ items, total }` envelope so the dashboard is forwards-compatible with
 * a future paginated endpoint.
 *
 * @returns {Promise<import('./types.js').OperationNoteRow[]>}
 */
async function fetchOperationNotes() {
  const res = await fetch(`${API_BASE}${OPERATION_NOTES_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch operation notes: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardOperationNotesResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

window.MedicalOperationNoteDashboard.fetchOperationNotes =
  fetchOperationNotes;
window.MedicalOperationNoteDashboard.API_BASE = API_BASE;
})();
