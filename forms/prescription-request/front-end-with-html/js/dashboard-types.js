// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Priority classification emitted by the prescription-request scoring engine.
 *
 * @typedef {'routine' | 'urgent' | 'emergency'} PriorityLevel
 */

/**
 * Request-type classification — distinguishes a brand-new prescription from
 * a refill of an existing prescription.
 *
 * @typedef {'New' | 'Refill'} RequestType
 */

/**
 * Workflow status for a prescription request.
 *
 * @typedef {'submitted' | 'reviewed' | 'approved'} RequestStatus
 */

/**
 * Prescription request row displayed in the clinician dashboard.
 *
 * Mirrors `PrescriptionRow` in
 * `forms/prescription-request/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PrescriptionRow
 * @property {string} id              - UUID of the request record
 * @property {string} nhsNumber       - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName     - "Surname, Given" display name
 * @property {string} clinicianName   - Prescribing clinician display name
 * @property {string} medicationName  - Brand or generic medication name
 * @property {string} dosage          - Dosage instructions (e.g. "500mg TDS")
 * @property {RequestType} requestType    - "New" or "Refill"
 * @property {PriorityLevel} priorityLevel - Priority classification
 * @property {string} requestDate     - ISO date (YYYY-MM-DD) of the request
 * @property {RequestStatus} status   - Workflow status
 */

/**
 * Response from `GET /api/dashboard/prescriptions`.
 *
 * @typedef {Object} DashboardPrescriptionsResponse
 * @property {PrescriptionRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.PrescriptionRequestDashboard`.
