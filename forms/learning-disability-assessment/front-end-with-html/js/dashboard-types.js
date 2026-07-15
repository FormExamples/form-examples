// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * DSM-5-TR aligned severity category emitted by the LD scoring engine.
 *
 * @typedef {'Mild' | 'Moderate' | 'Severe' | 'Profound'} SeverityCategory
 */

/**
 * Communication-needs label captured during the assessment. 'Standard' means
 * the patient communicates in spoken/written English without any adaptation;
 * the other values name the specific accessible-information format required.
 *
 * @typedef {'Standard' | 'Easy-Read' | 'Makaton' | 'AAC'} CommunicationNeed
 */

/**
 * Mental-capacity status under the UK Mental Capacity Act 2005, as recorded
 * by the assessing clinician on the consent step.
 *
 * @typedef {'Has Capacity' | 'Lacks Capacity'} CapacityStatus
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/learning-disability-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                              - UUID of the assessment record
 * @property {string} nhsNumber                       - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName                     - "Surname, Given" display name
 * @property {SeverityCategory} severity              - LD severity category
 * @property {string} iqBand                          - DSM-5-TR aligned IQ band, e.g. "50-69"
 * @property {CommunicationNeed} communicationNeed    - Required accessible-information format
 * @property {CapacityStatus} capacityStatus          - Mental Capacity Act 2005 status
 * @property {boolean} reasonableAdjustmentsRequired  - True when the care plan requires reasonable adjustments
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.LearningDisabilityAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.LearningDisabilityAssessmentDashboard`.
