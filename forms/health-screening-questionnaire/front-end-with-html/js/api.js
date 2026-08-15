// Back-end API client for the Health Screening Questionnaire dashboard.
//
// The back-end lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns either a bare JSON array of `QuestionnaireRow` objects or
// an `{ items, total }` envelope. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data
// shipped in `data.js` so the page is usable standalone.

const API_BASE = 'http://localhost:5150';
const QUESTIONNAIRES_PATH = '/api/health_screening_questionnaires';

/**
 * Fetch the questionnaire list from the back-end.
 *
 * Resolves with the questionnaire array on a successful 2xx response. Rejects
 * on any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').QuestionnaireRow[]>}
 */
async function fetchQuestionnaires() {
  const res = await fetch(`${API_BASE}${QUESTIONNAIRES_PATH}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch questionnaires: ${res.status} ${res.statusText}`);
  }
  /** @type {import('./dashboard-types.js').DashboardQuestionnairesResponse} */
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export { fetchQuestionnaires, API_BASE };
