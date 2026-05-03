// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Allergy severity level — matches the strings emitted by the scoring engine.
 *
 * @typedef {'mild' | 'moderate' | 'severe'} SeverityLevel
 */

/**
 * Workflow status for a submitted allergy assessment.
 *
 * @typedef {'pending' | 'reviewed' | 'urgent'} AssessmentStatus
 */

/**
 * Primary allergy type — the dominant category (drug / food / environmental).
 *
 * @typedef {'Drug' | 'Food' | 'Environmental'} PrimaryAllergyType
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/allergy-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                          - UUID of the assessment record
 * @property {string} nhsNumber                   - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {SeverityLevel} severityLevel        - Allergy severity classification
 * @property {number} allergenCount               - Total distinct allergens recorded
 * @property {PrimaryAllergyType} primaryAllergyType - Dominant allergy category
 * @property {boolean} hasAnaphylaxis             - True if anaphylaxis history present
 * @property {number} burdenScore                 - Composite allergy burden score
 * @property {number} flagCount                   - Number of flagged clinical issues
 * @property {AssessmentStatus} status            - Workflow status for the submission
 * @property {string} submittedDate               - ISO yyyy-mm-dd submission date
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
// namespace, `window.AllergyAssessmentDashboard`.
(function () {
'use strict';
window.AllergyAssessmentDashboard = window.AllergyAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AllergyAssessmentDashboard`.
})();
