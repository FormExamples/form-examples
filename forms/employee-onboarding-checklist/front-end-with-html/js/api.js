// Backend API client for the HR / management dashboard.
//
// The backend lives at http://localhost:5150 (Loco / axum); the dashboard
// endpoint returns a `DashboardEmployeesResponse`. When the fetch fails
// (CORS, network, server down) or returns an empty list, callers fall
// back to the sample data shipped in `data.js` so the page is usable
// standalone.

const API_BASE = 'http://localhost:5150';
const EMPLOYEES_PATH = '/api/dashboard/employees';

/**
 * Fetch the employee list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on
 * any network error or non-2xx response so the caller can fall back to
 * sample data and surface a user-visible notice.
 *
 * @returns {Promise<import('./types.js').EmployeeRow[]>}
 */
async function fetchEmployees() {
  const res = await fetch(`${API_BASE}${EMPLOYEES_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch employees: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./types.js').DashboardEmployeesResponse} */
  const data = await res.json();
  return data.items || [];
}

export { fetchEmployees, API_BASE };
