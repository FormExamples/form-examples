// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total GCS — integer 3-15, or null when undefined (any component NT).
 *
 * @typedef {number | null} TotalScore
 */

/**
 * Derived severity band emitted by the scoring engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation; '' when the total is undefined.
 *
 * @typedef {'mild' | 'moderate' | 'severe' | ''} SeverityBand
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'ed' | 'neuro' | 'critical-care' | 'pre-hospital' | 'other'} Setting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/glasgow-coma-scale/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {Setting} setting            - where the assessment was performed
 * @property {TotalScore} totalScore     - total GCS (3-15) or null when NT
 * @property {string} totalDisplay       - reported total, e.g. "12", "9T", or "NT"
 * @property {SeverityBand} severityBand - derived severity band
 * @property {number | null} gcsP        - GCS-Pupils score (1-15) or null
 * @property {boolean} airwayFlag        - true when a defined total <= 8 (coma)
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
// before they read `window.GlasgowComaScaleDashboard`.
