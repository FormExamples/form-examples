// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Signed ROSIER total — integer -2..+5, or null when not yet scored.
 *
 * @typedef {number | null} RosierScore
 */

/**
 * Derived band emitted by the scoring engine. Lower-case strings matching the
 * SvelteKit dashboard so the same backend payload can drive either UI without
 * translation.
 *
 * @typedef {'stroke-unlikely' | 'stroke-likely'} Band
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'emergency-department' | 'acute-medical' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/recognition-of-stroke-in-the-emergency-room/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {RosierScore} rosierScore   - signed ROSIER total (-2..+5) or null
 * @property {Band} band                 - derived band
 * @property {boolean} activatePathway    - true when rosierScore > 0 (stroke likely)
 * @property {string} assessedAt         - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.RecognitionOfStrokeInTheEmergencyRoomDashboard`.
