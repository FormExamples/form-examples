// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Dyslexia severity-level labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'No Dyslexia' | 'Mild' | 'Moderate' | 'Severe'} SeverityLevel
 */

/**
 * Standardised-score band emitted by the scoring engine for the reading
 * sub-test (mean 100, SD 15).
 *
 * @typedef {'Average' | 'Below Average' | 'Well Below Average' | 'Significantly Below Average'} ReadingSeverity
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/dyslexia-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                        - UUID of the assessment record
 * @property {string} nhsNumber                 - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName               - "Surname, Given" display name
 * @property {number} standardScore             - Overall standardised score, mean 100 SD 15
 * @property {SeverityLevel} severityLevel      - Dyslexia severity classification
 * @property {ReadingSeverity} readingSeverity  - Reading-subtest severity band
 * @property {boolean} familyHistoryFlag        - True when first-degree family history present
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.DyslexiaAssessmentDashboard`.
