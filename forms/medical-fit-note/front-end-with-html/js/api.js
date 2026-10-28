// Backend API client for the medical fit note dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `FitNoteRow` objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const FIT_NOTES_PATH = '/api/medical_fit_notes';

/**
 * Fetch the fit-note list from the backend.
 *
 * Rejects on any network error or non-2xx response so the caller can fall
 * back to sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').FitNoteRow[]>}
 */
async function fetchFitNotes() {
  const res = await fetch(`${API_BASE}${FIT_NOTES_PATH}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch fit notes: ${res.status} ${res.statusText}`);
  }
  /** @type {import('./types.js').DashboardFitNotesResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export { fetchFitNotes, API_BASE };
