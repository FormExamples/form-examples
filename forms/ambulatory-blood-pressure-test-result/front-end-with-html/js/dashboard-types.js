// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` dashboard data model for the Ambulatory Blood
// Pressure (ABPM) test-result clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Monitoring modality reported.
 *
 * @typedef {'24-hour-abpm' | 'home-blood-pressure-monitoring' | 'other' | ''} MonitoringType
 */

/**
 * Report lifecycle status.
 *
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Axis A — overall result classification.
 *
 * @typedef {'normal' | 'abnormal' | 'critical' | 'inconclusive' | ''} ResultClassification
 */

/**
 * Axis B — abnormality severity.
 *
 * @typedef {'none' | 'minor' | 'moderate' | 'major' | ''} AbnormalitySeverity
 */

/**
 * Axis D — follow-up urgency.
 *
 * @typedef {'routine' | 'recommended' | 'urgent' | 'critical-alert' | ''} FollowUpUrgency
 */

/**
 * A graded report row displayed in the clinician dashboard.
 *
 * Mirrors `ReportRow` in
 * `forms/ambulatory-blood-pressure-test-result/front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} ReportRow
 * @property {string} id                              - report identifier
 * @property {string} patientName                     - patient display name
 * @property {MonitoringType} monitoringType          - monitoring modality
 * @property {ReportStatus} reportStatus              - report lifecycle status
 * @property {string} reportedDate                    - ISO date (yyyy-mm-dd)
 * @property {ResultClassification} resultClassification - Axis A
 * @property {AbnormalitySeverity} abnormalitySeverity   - Axis B
 * @property {FollowUpUrgency} followUpUrgency           - Axis D
 * @property {number} reportCompletenessPercent          - Axis C (0-100)
 * @property {number} flagCount                          - number of safety flags
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
// namespace, `window.AmbulatoryBloodPressureTestResultDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AmbulatoryBloodPressureTestResultDashboard`.
