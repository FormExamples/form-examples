// Backend API client for the United Kingdom death registration dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Axum); the dashboard endpoint returns a
// `DashboardRegistrationsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const REGISTRATIONS_PATH = '/api/dashboard/registrations';

/**
 * Fetch the registration list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').RegistrationRow[]>}
 */
async function fetchRegistrations() {
  const res = await fetch(`${API_BASE}${REGISTRATIONS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch registrations: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardRegistrationsResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchRegistrations, API_BASE };
