// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United Kingdom Council Tax Discount
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
 * Application row displayed in the dashboard.
 *
 * Mirrors `ApplicationRow` in
 * `forms/united-kingdom-council-tax-discount-application/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ApplicationRow
 * @property {string} id                       - UUID of the application record
 * @property {string} accountReference         - Council Tax account reference
 * @property {string} applicantName            - "Surname, Given" display name
 * @property {string} claimType                - the claim type
 * @property {EligibilityClass} eligibilityClass - likely-eligible | incomplete | likely-ineligible
 * @property {string} indicativeOutcome        - the indicative outcome
 * @property {string} billingAuthority         - the council the application goes to
 * @property {string} updatedAt                - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-kingdom-council-tax-discount-application/dashboard/applications`.
 * @typedef {Object} DashboardApplicationsResponse
 * @property {ApplicationRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
