// Plain-JavaScript / JSDoc type definitions for the Medical Human Leukocyte and
// Disease Association Request vetting dashboard. Exports nothing executable.

/**
 * @typedef {'usually-appropriate' | 'may-be-appropriate' | 'usually-not-appropriate'} AppropriatenessBand
 * @typedef {'ok' | 'caution' | 'reject-risk'} IdentitySafetyBand
 * @typedef {'routine' | 'urgent' | 'emergency' | 'stat'} TriageTier
 */

/**
 * Request row displayed in the vetting dashboard.
 *
 * @typedef {Object} RequestRow
 * @property {string} id              - UUID / case identifier of the request
 * @property {string} requestDate     - ISO date "YYYY-MM-DD" of the request
 * @property {string} patient         - Patient display name
 * @property {string} identifier      - National health identifier or record number
 * @property {string} indication      - Indication category (kebab-case)
 * @property {string} tests           - Requested tests, comma-separated labels
 * @property {string} plannedDrug     - Drug whose prescribing depends on the result, if any
 * @property {AppropriatenessBand} appropriatenessBand - Axis A band
 * @property {IdentitySafetyBand} identitySafetyBand   - Axis B band
 * @property {TriageTier} triageTier  - Axis D triage tier
 * @property {number} completenessPercent - Axis C completeness 0..100
 * @property {string} clinician       - Requesting clinician display name
 * @property {string[]} flags         - Safety-flag categories (kebab-case)
 */

/**
 * Response from the requests list endpoint: a bare array, or an
 * { items, total } envelope.
 *
 * @typedef {RequestRow[] | { items: RequestRow[], total?: number }} DashboardRequestsResponse
 */
