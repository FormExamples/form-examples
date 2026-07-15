// Backend API client for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardReviewsResponse`. When the fetch fails (CORS, network, server down)
// or returns an empty list, callers fall back to the sample data shipped in
// `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const REVIEWS_PATH = '/api/dashboard/reviews';

/**
 * Fetch the review list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').ReviewRow[]>}
 */
async function fetchReviews() {
  const res = await fetch(`${API_BASE}${REVIEWS_PATH}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch reviews: ${res.status} ${res.statusText}`);
  }
  /** @type {import('./dashboard-types.js').DashboardReviewsResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchReviews, API_BASE };
