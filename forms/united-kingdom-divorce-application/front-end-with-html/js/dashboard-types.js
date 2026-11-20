// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United Kingdom divorce application
// caseworker dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Application class emitted by the engine.
 * @typedef {'ready-to-apply' | 'incomplete' | 'not-eligible-yet'} ApplicationClass
 */

/**
 * Application row displayed in the caseworker dashboard.
 *
 * Mirrors `ApplicationRow` in
 * `forms/united-kingdom-divorce-application/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ApplicationRow
 * @property {string} id                       - UUID of the application record
 * @property {string} applicantName            - "Surname, Given" display name
 * @property {string} respondentName           - "Surname, Given" display name
 * @property {string} stage                    - application | conditional-order | final-order
 * @property {ApplicationClass} applicationClass
 * @property {string} earliestEligibleDate     - ISO date; '' when no gate applies
 * @property {string} caseworkerName           - caseworker who prepared the application
 * @property {string} updatedAt                - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-kingdom-divorce-application/dashboard/applications`.
 * @typedef {Object} DashboardApplicationsResponse
 * @property {ApplicationRow[]} items
 * @property {number} total
 */

export {};
