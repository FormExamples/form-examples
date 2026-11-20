// Backend API client for the United States Property Tax Exemption Application
// assessor dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Axum); the dashboard endpoint returns a
// `DashboardApplicationsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const APPLICATIONS_PATH = '/api/united-states-property-tax-exemption-application/dashboard/applications';

/**
 * Fetch the application list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').ApplicationRow[]>}
 */
async function fetchApplications() {
  const res = await fetch(`${API_BASE}${APPLICATIONS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch applications: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardApplicationsResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchApplications, API_BASE };
