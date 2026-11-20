// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United States vehicle title and
// registration application dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Application class emitted by the engine.
 * @typedef {'ready-to-submit' | 'incomplete' | 'title-brand-or-lien-issue'} ApplicationClass
 */

/**
 * Application row displayed in the clerk dashboard.
 *
 * Mirrors `DashboardRow` in
 * `forms/united-states-vehicle-title-and-registration-application/front-end-with-svelte/src/lib/data/sample-reports.ts`.
 *
 * @typedef {Object} ApplicationRow
 * @property {string} id                     - UUID of the application record
 * @property {string} ownerName              - owner's full name
 * @property {string} vin                    - vehicle identification number
 * @property {string} state                  - two-letter state code
 * @property {string} vehicle                - "year make model"
 * @property {ApplicationClass} applicationClass - ready-to-submit | incomplete | title-brand-or-lien-issue
 * @property {boolean} brandOrLienIssue      - a brand, NMVTIS, lien, or odometer issue is present
 * @property {number} outstandingItemCount   - items still missing
 * @property {string} updatedAt              - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-states-vehicle-title-and-registration-application/dashboard/applications`.
 * @typedef {Object} DashboardApplicationsResponse
 * @property {ApplicationRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read the dashboard namespace.
