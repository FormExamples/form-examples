// Back-end API client for the Perioperative Optimization dashboard.
//
// The back-end lives at http://localhost:5150 (Loco / axum). When the fetch
// fails (CORS, network, server down) or returns an empty list, callers fall
// back to the sample data in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const ASSESSMENTS_PATH = '/api/perioperative_optimizations';

/**
 * Fetch the assessment list from the back-end.
 *
 * Resolves with the assessment array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to sample
 * data and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').AssessmentRow[]>}
 */
async function fetchAssessments() {
  const res = await fetch(`${API_BASE}${ASSESSMENTS_PATH}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch assessments: ${res.status} ${res.statusText}`);
  }
  /** @type {import('./dashboard-types.js').DashboardResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export { fetchAssessments, API_BASE };
