// Backend API client for the Fluid Balance Chart clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardChartsResponse`. When the fetch fails (CORS, network, server down)
// or returns an empty list, callers fall back to the sample data shipped in
// `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const CHARTS_PATH = '/api/dashboard/charts';

/**
 * Fetch the chart list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').ChartRow[]>}
 */
async function fetchCharts() {
  const res = await fetch(`${API_BASE}${CHARTS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch charts: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardChartsResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchCharts, API_BASE };
