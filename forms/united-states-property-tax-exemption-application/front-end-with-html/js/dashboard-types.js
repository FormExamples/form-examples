// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United States Property Tax Exemption
// Application dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Eligibility class emitted by the engine.
 * @typedef {'likely-eligible' | 'incomplete' | 'likely-ineligible'} EligibilityClass
 */

/**
 * Application row displayed in the assessor dashboard.
 *
 * Mirrors `ApplicationRow` in
 * `forms/united-states-property-tax-exemption-application/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ApplicationRow
 * @property {string} id                  - UUID of the application record
 * @property {string} parcelNumber        - assessor parcel number
 * @property {string} applicantName       - "Surname, Given" display name
 * @property {EligibilityClass} eligibilityClass - likely-eligible | incomplete | likely-ineligible
 * @property {string} exemptionsClaimed   - exemptions claimed, comma separated
 * @property {boolean} filedLate          - filed after the state deadline
 * @property {string} countyState         - "County, ST"
 * @property {string} updatedAt           - ISO date the record was last updated
 */

/**
 * Response from `GET /api/dashboard/applications`.
 * @typedef {Object} DashboardApplicationsResponse
 * @property {ApplicationRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
