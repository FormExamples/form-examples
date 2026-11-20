// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/data/sample-reports.ts` data model for the United Kingdom Last Will
// and Testament dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Validity class emitted by the engine.
 * @typedef {'valid' | 'incomplete' | 'formality-risk'} ValidityClass
 */

/**
 * Will row displayed in the wills dashboard.
 *
 * Mirrors `WillRow` in
 * `forms/united-kingdom-last-will-and-testament/front-end-with-svelte/src/lib/data/sample-reports.ts`.
 *
 * @typedef {Object} WillRow
 * @property {string} id                       - UUID of the will record
 * @property {string} testatorName             - "Surname, Given" display name
 * @property {'draft' | 'signed'} executionStatus - draft or signed and witnessed
 * @property {ValidityClass} validityClass     - valid | incomplete | formality-risk
 * @property {number} sharesTotalPercent       - total of the beneficiary shares
 * @property {number} witnessCount             - witnesses named
 * @property {boolean} formalityRisk           - a Wills Act 1837 formality risk is indicated
 * @property {string} updatedAt                - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-kingdom-last-will-and-testament/dashboard/wills`.
 * @typedef {Object} DashboardWillsResponse
 * @property {WillRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
