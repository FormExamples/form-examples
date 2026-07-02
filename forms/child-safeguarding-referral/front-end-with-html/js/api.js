// Backend API client for the Child Safeguarding Referral duty-team dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/api.ts`. The backend lives at
// http://localhost:5150 (Loco / axum); the dashboard endpoint returns a
// `DashboardReferralsResponse`. When the fetch fails (CORS, network, server
// down) or returns an empty list, callers fall back to the sample data shipped
// in `data.js` so the page is usable standalone.

(function () {
'use strict';
window.ChildSafeguardingReferralDashboard =
  window.ChildSafeguardingReferralDashboard || {};

const API_BASE = 'http://localhost:5150';
const REFERRALS_PATH = '/api/dashboard/referrals';

/**
 * Fetch the referral list from the backend.
 *
 * Resolves with the `items` array on a successful 2xx response. Rejects on any
 * network error or non-2xx response so the caller can fall back to sample data
 * and surface a user-visible notice.
 *
 * @returns {Promise<import('./dashboard-types.js').ReferralRow[]>}
 */
async function fetchReferrals() {
  const res = await fetch(`${API_BASE}${REFERRALS_PATH}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch referrals: ${res.status} ${res.statusText}`
    );
  }
  /** @type {import('./dashboard-types.js').DashboardReferralsResponse} */
  const data = await res.json();
  return data.items || [];
}

window.ChildSafeguardingReferralDashboard.fetchReferrals = fetchReferrals;
window.ChildSafeguardingReferralDashboard.API_BASE = API_BASE;
})();
