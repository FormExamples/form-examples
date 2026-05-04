// Backend API client for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api/assessments.ts`. The backend
// lives at http://localhost:5150 (Loco / axum); the dashboard endpoint
// returns either a bare JSON array of `AssessmentRow` objects or a
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.PreOperativeAssessmentByClinicianDashboard =
  window.PreOperativeAssessmentByClinicianDashboard || {};

const API_BASE = 'http://localhost:5150';
const ASSESSMENTS_PATH = '/api/assessments';

/**
 * Fetch the assessment list from the backend.
 *
 * Resolves with the assessment array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * Accepts both the bare-array shape (`AssessmentRow[]`) and the
 * `{ items, total }` envelope so the dashboard is forwards-compatible with a
 * future paginated endpoint.
 *
 * @returns {Promise<import('./types.js').AssessmentRow[]>}
 */
async function fetchAssessments() {
  const res = await fetch(`${API_BASE}${ASSESSMENTS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch assessments: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardAssessmentsResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

window.PreOperativeAssessmentByClinicianDashboard.fetchAssessments =
  fetchAssessments;
window.PreOperativeAssessmentByClinicianDashboard.API_BASE = API_BASE;
})();
