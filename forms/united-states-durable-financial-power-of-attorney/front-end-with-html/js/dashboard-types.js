// Plain-JavaScript / JSDoc type definitions for the United States durable
// financial power of attorney readiness dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports.

/**
 * Validity class emitted by the engine.
 * @typedef {'ready-to-execute' | 'incomplete' | 'execution-risk'} ValidityClass
 */

/**
 * Instrument row displayed in the readiness dashboard.
 *
 * @typedef {Object} InstrumentRow
 * @property {string} id                       - UUID of the instrument record
 * @property {string} principalName            - "Surname, Given" display name
 * @property {string} state                    - governing state, two-letter code
 * @property {ValidityClass} validityClass     - ready-to-execute | incomplete | execution-risk
 * @property {string} governingState           - state rule applied
 * @property {boolean} executionRiskIndicated  - an answered item contradicts the state rule
 * @property {string} agentName                - primary agent
 * @property {string} updatedAt                - ISO date the record was last updated
 */

/**
 * Response from `GET /api/dashboard/instruments`.
 * @typedef {Object} DashboardInstrumentsResponse
 * @property {InstrumentRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
