// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Social Security card application
// (Form SS-5) dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Application class emitted by the engine.
 * @typedef {'ready-to-submit' | 'incomplete' | 'evidence-missing' | 'not-eligible'} ApplicationClass
 */

/**
 * Application row displayed in the preparer dashboard.
 *
 * Mirrors `ApplicationRow` in
 * `forms/united-states-social-security-card-application/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ApplicationRow
 * @property {string} id                         - UUID of the application record
 * @property {string} applicantName              - "Surname, Given" display name
 * @property {string} requestType                - original | replacement | correction
 * @property {ApplicationClass} applicationClass - ready-to-submit | incomplete | evidence-missing | not-eligible
 * @property {number} missingEvidenceCount       - evidence items missing or unacceptable
 * @property {boolean} replacementLimitReached   - 3-per-year or 10-per-lifetime limit reached
 * @property {string} preparerName               - person who prepared the application
 * @property {string} updatedAt                  - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-states-social-security-card-application/dashboard/applications`.
 * @typedef {Object} DashboardApplicationsResponse
 * @property {ApplicationRow[]} items
 * @property {number} total
 */
