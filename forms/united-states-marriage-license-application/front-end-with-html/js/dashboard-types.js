// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United States marriage license
// application dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Application class emitted by the engine.
 * @typedef {'ready-to-apply' | 'incomplete' | 'not-eligible'} ApplicationClass
 */

/**
 * Application row displayed in the review dashboard.
 *
 * Mirrors `ApplicationRow` in
 * `forms/united-states-marriage-license-application/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ApplicationRow
 * @property {string} id                       - UUID of the application record
 * @property {string} reference                - local application reference
 * @property {string} applicants               - "Surname and Surname" display name
 * @property {ApplicationClass} applicationClass - ready-to-apply | incomplete | not-eligible
 * @property {string} earliestCeremony         - earliest permitted ceremony date ('' when unknown)
 * @property {boolean} verifyStateRule         - the state is not in the rule table; verify with the clerk
 * @property {string} jurisdiction             - "State, County"
 * @property {string} updatedAt                - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-states-marriage-license-application/dashboard/applications`.
 * @typedef {Object} DashboardApplicationsResponse
 * @property {ApplicationRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
