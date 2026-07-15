// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` `ReportRow` for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * @typedef {'normal' | 'abnormal' | 'critical' | 'inconclusive' | ''} ResultClassification
 * @typedef {'none' | 'minor' | 'moderate' | 'major' | ''} AbnormalitySeverity
 * @typedef {'routine' | 'recommended' | 'urgent' | 'critical-alert' | ''} FollowUpUrgency
 * @typedef {'preliminary' | 'final' | 'amended' | 'supplementary' | 'cancelled' | ''} ReportStatus
 */

/**
 * A graded biopsy report row displayed in the clinician dashboard.
 *
 * Mirrors `ReportRow` in
 * `forms/biopsy-test-result/front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} ReportRow
 * @property {string} id                              - report identifier
 * @property {string} patientName                     - patient display name
 * @property {string} biopsySite                      - anatomical biopsy site
 * @property {ReportStatus} reportStatus              - report lifecycle status
 * @property {string} reportedDate                    - ISO date (yyyy-mm-dd)
 * @property {ResultClassification} resultClassification - Axis A
 * @property {AbnormalitySeverity} abnormalitySeverity   - Axis B
 * @property {FollowUpUrgency} followUpUrgency        - Axis D
 * @property {number} reportCompletenessPercent       - Axis C (0-100)
 * @property {number} flagCount                       - number of safety flags
 */

/**
 * Response from `GET /api/dashboard/reports`.
 *
 * @typedef {Object} DashboardReportsResponse
 * @property {ReportRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.BiopsyTestResultDashboard`.
