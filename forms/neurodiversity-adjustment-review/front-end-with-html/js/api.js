// Backend API client for the neurodiversity adjustment review dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `ReviewRow` objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const REVIEWS_PATH = '/api/neurodiversity_adjustment_reviews';

/**
 * Fetch the review list from the backend.
 *
 * Resolves with the review array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to sample
 * data and surface a user-visible notice.
 *
 * Accepts both the bare-array shape (`ReviewRow[]`) and the
 * `{ items, total }` envelope so the dashboard is forwards-compatible with a
 * future paginated endpoint.
 *
 * @returns {Promise<import('./dashboard-types.js').ReviewRow[]>}
 */
async function fetchReviews() {
  const res = await fetch(`${API_BASE}${REVIEWS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch reviews: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardReviewsResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export { fetchReviews, API_BASE };
