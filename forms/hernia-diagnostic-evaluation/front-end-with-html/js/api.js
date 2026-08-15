// Back-end API client for the Hernia Diagnostic Evaluation dashboard.
//
// The back-end lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `EvaluationRow` objects or an
// `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const EVALUATIONS_PATH = '/api/hernia_diagnostic_evaluations';

/**
 * Fetch the assessment list from the back-end.
 *
 * Resolves with the assessment array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to sample
 * data and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').EvaluationRow[]>}
 */
async function fetchEvaluations() {
  const res = await fetch(`${API_BASE}${EVALUATIONS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch assessments: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardAssessmentsResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export { fetchEvaluations, API_BASE };
