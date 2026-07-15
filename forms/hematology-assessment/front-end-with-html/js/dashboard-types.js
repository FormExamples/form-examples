// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Hematology abnormality level emitted by the scoring engine. Used both as a
 * filter value and as the badge label key.
 *
 * @typedef {'normal' | 'mildAbnormality' | 'moderateAbnormality' | 'severeAbnormality' | 'critical' | 'draft'} AbnormalityLevel
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/hematology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} patientName           - "Surname, Given" display name
 * @property {string} mrn                   - Medical record number
 * @property {string} specimenDate          - ISO 8601 date (YYYY-MM-DD)
 * @property {string} referringPhysician    - Referring clinician name
 * @property {AbnormalityLevel} abnormalityLevel - Composite haematological category
 * @property {number} abnormalityScore      - Composite score, 0-100
 * @property {string} diagnosis             - Free-text diagnosis summary
 * @property {number} flagCount             - Number of flagged clinical issues
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
// before they read `window.HematologyAssessmentDashboard`.
