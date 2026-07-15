// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total CAGE score — integer 0-4, or null when not yet scored.
 *
 * @typedef {0 | 1 | 2 | 3 | 4 | null} CageScore
 */

/**
 * Derived result band emitted by the scoring engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation.
 *
 * @typedef {'negative' | 'low' | 'positive'} ResultBand
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'primary-care' | 'ward' | 'emergency-department' | 'antenatal' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/cage-alcohol-questionnaire/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {CageScore} cageScore       - total CAGE score (0-4) or null
 * @property {ResultBand} resultBand     - derived result band
 * @property {boolean} positiveScreen    - true when CAGE >= 2 (positive screen)
 * @property {boolean} eyeOpener         - true when the eye-opener item is 'yes'
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
// before they read `window.CageAlcoholQuestionnaireDashboard`.
