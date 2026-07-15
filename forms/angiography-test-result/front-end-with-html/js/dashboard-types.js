// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` `ReportRow` data model for the clinician
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Axis A result classification emitted by the grading engine.
 *
 * @typedef {'normal' | 'abnormal' | 'critical' | 'inconclusive' | ''} ResultClassification
 */

/**
 * Axis B abnormality severity emitted by the grading engine.
 *
 * @typedef {'none' | 'minor' | 'moderate' | 'major' | ''} AbnormalitySeverity
 */

/**
 * Axis D follow-up urgency emitted by the grading engine.
 *
 * @typedef {'routine' | 'recommended' | 'urgent' | 'critical-alert' | ''} FollowUpUrgency
 */

/**
 * Report lifecycle status.
 *
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Examined arterial territory.
 *
 * @typedef {'coronary' | 'cerebral' | 'carotid' | 'aorta' | 'renal' | 'peripheral-lower-limb' | 'pulmonary' | 'mesenteric' | 'other' | ''} BodyRegion
 */

/**
 * A graded report row displayed in the clinician dashboard.
 *
 * Mirrors `ReportRow` in
 * `forms/angiography-test-result/front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} ReportRow
 * @property {string} id                            - report identifier
 * @property {string} patientName                   - patient display name
 * @property {BodyRegion} bodyRegion                - examined arterial territory
 * @property {ReportStatus} reportStatus            - report lifecycle status
 * @property {string} reportedDate                  - ISO date reported (yyyy-mm-dd)
 * @property {ResultClassification} resultClassification - Axis A
 * @property {AbnormalitySeverity} abnormalitySeverity   - Axis B
 * @property {FollowUpUrgency} followUpUrgency           - Axis D
 * @property {number} reportCompletenessPercent          - Axis C (0-100)
 * @property {number} flagCount                          - raised safety flags
 */

/**
 * Response from `GET /api/dashboard/reports`.
 *
 * @typedef {Object} DashboardReportsResponse
 * @property {ReportRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AngiographyTestResultDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AngiographyTestResultDashboard`.
