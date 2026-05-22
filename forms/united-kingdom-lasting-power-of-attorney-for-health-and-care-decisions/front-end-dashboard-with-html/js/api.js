// Backend API client. Mirrors the SvelteKit dashboard's `src/lib/api/lpa.ts`.
// The Loco backend lives at http://localhost:5150. On any network or
// non-2xx response we fall back to sample data and surface a banner.

(function () {
'use strict';
window.UkLpaDashboard = window.UkLpaDashboard || {};

const API_BASE = 'http://localhost:5150';
const LPAS_PATH = '/api/lpa';

/**
 * Fetch the LPA list from the backend.
 *
 * @returns {Promise<import('./types.js').LpaRow[]>}
 */
async function fetchLpas() {
  const res = await fetch(`${API_BASE}${LPAS_PATH}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch LPAs: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

window.UkLpaDashboard.fetchLpas = fetchLpas;
window.UkLpaDashboard.API_BASE = API_BASE;
})();
