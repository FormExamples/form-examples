// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United Kingdom Vehicle Bill of Sale
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Classification emitted by the engine.
 * @typedef {'complete' | 'incomplete' | 'risk-flagged'} Classification
 */

/**
 * Bill-of-sale row displayed in the dashboard.
 *
 * @typedef {Object} BillOfSaleRow
 * @property {string} id                 - UUID of the bill-of-sale record
 * @property {string} registration       - vehicle registration number
 * @property {string} vehicle            - "Make Model" display name
 * @property {string} sellerName         - seller
 * @property {string} buyerName          - buyer
 * @property {Classification} classification - complete | incomplete | risk-flagged
 * @property {number} riskFlagCount      - number of risk conditions that hold
 * @property {number} missingItemCount   - number of required items missing
 * @property {string} updatedAt          - ISO date the record was last updated
 */

/**
 * Response from `GET /api/dashboard/bills-of-sale`.
 * @typedef {Object} DashboardBillsOfSaleResponse
 * @property {BillOfSaleRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
