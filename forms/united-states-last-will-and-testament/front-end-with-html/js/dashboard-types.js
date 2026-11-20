// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United States Last Will and Testament
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Validity class emitted by the engine.
 * @typedef {'valid-ready-to-execute' | 'incomplete' | 'formality-risk'} ValidityClass
 */

/**
 * Will row displayed in the drafter dashboard.
 *
 * Mirrors `WillRow` in
 * `forms/united-states-last-will-and-testament/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} WillRow
 * @property {string} id                             - UUID of the will record
 * @property {string} testatorName                   - "Surname, Given" display name
 * @property {string} state                          - two-letter state code
 * @property {string} executionForm                  - witnessed | holographic | electronic
 * @property {ValidityClass} validityClass           - valid-ready-to-execute | incomplete | formality-risk
 * @property {number} highFlagCount                  - number of high-priority flags
 * @property {string} personalRepresentativeName     - named executor
 * @property {string} updatedAt                      - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-states-last-will-and-testament/dashboard/wills`.
 * @typedef {Object} DashboardWillsResponse
 * @property {WillRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
