// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United States Vehicle Bill of Sale
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Completeness class emitted by the engine.
 * @typedef {'complete' | 'incomplete' | 'risk-flagged'} CompletenessClass
 */

/**
 * Bill of sale row displayed in the review dashboard.
 *
 * Mirrors `BillOfSaleRow` in
 * `forms/united-states-vehicle-bill-of-sale/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} BillOfSaleRow
 * @property {string} id                             - identifier of the bill of sale record
 * @property {string} vin                            - Vehicle Identification Number
 * @property {string} vehicle                        - "2018 Honda Accord" display text
 * @property {CompletenessClass} completenessClass   - complete | incomplete | risk-flagged
 * @property {string} leadIssue                      - highest-priority flag category ('' when none)
 * @property {boolean} odometerExempt                - the federal odometer disclosure is exempt
 * @property {string} sellerName                     - seller printed name
 * @property {string} updatedAt                      - ISO date the record was last updated
 */

/**
 * Response from `GET /api/dashboard/bills-of-sale`.
 * @typedef {Object} DashboardBillsOfSaleResponse
 * @property {BillOfSaleRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read the dashboard namespace.
