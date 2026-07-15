// Backend API client for the Care Privacy Notice clinician dashboard.
// Loaded as a classic <script> tag (no ES modules) and attaches its
// public symbols to `window.CarePrivacyNoticeDashboard`.

const API_BASE = 'http://localhost:5150';

/**
 * Fetch privacy notice acknowledgements from the backend API.
 * Resolves to an array of patient rows; throws on transport or HTTP errors.
 */
async function fetchPatients() {
  const res = await fetch(API_BASE + '/api/dashboard/acknowledgments');
  if (!res.ok) {
    throw new Error('Failed to fetch acknowledgements: ' + res.status);
  }
  const data = await res.json();
  return data.items || [];
}

export { fetchPatients };
