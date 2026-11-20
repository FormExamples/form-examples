// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United Kingdom Vehicle Registration
// Application dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Validity class emitted by the engine.
 * @typedef {'ready-to-submit' | 'incomplete' | 'needs-supporting-documents'} ValidityClass
 */

/**
 * Application row displayed in the dashboard.
 *
 * Mirrors `ApplicationRow` in
 * `forms/united-kingdom-vehicle-registration-application/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ApplicationRow
 * @property {string} id                             - UUID of the application record
 * @property {string} applicantName                  - applicant display name
 * @property {string} applicationType                - v62-replacement-v5c | v62-acquired-without-v5c | v55-4-new-vehicle | v55-5-used-vehicle | imported-vehicle | v627-1-rebuilt-or-kit
 * @property {string} registrationNumber             - vehicle registration mark ('' for a first registration)
 * @property {ValidityClass} validityClass           - ready-to-submit | incomplete | needs-supporting-documents
 * @property {number | null} feeDueAsPence           - fee the DVLA requires, in pence
 * @property {number} missingItemCount               - missing data items and documents
 * @property {string} updatedAt                      - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-kingdom-vehicle-registration-application/dashboard/applications`.
 * @typedef {Object} DashboardApplicationsResponse
 * @property {ApplicationRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
