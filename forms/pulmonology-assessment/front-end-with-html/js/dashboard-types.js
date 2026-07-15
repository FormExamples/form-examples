// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * GOLD COPD stage emitted by the scoring engine. Stored as a number 1-4
 * (matches the SvelteKit schema). Display labels render as "GOLD I" .. "GOLD IV".
 *
 * @typedef {1 | 2 | 3 | 4} GoldStage
 */

/**
 * GOLD ABCD assessment group ('E' replaces former 'C'/'D' per GOLD 2023+).
 *
 * @typedef {'A' | 'B' | 'E'} AbcdGroup
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/pulmonology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id            - UUID of the assessment record
 * @property {string} nhsNumber     - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName   - "Surname, Given" display name
 * @property {GoldStage} goldStage  - GOLD COPD stage 1..4
 * @property {AbcdGroup} abcdGroup  - GOLD ABCD assessment group
 * @property {boolean} allergyFlag  - True when allergy comorbidity present
 * @property {boolean} oxygenTherapy - True when long-term oxygen therapy in use
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
// before they read `window.PulmonologyAssessmentDashboard`.
