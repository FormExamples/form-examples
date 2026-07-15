// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * COPM score band labels — derived from the numeric performance and
 * satisfaction scores by the dashboard. Used both as filter values and as
 * the score-badge class suffix.
 *
 * - 'significant' — score < 5  (significant issues)
 * - 'moderate'    — score 5-7  (moderate concerns)
 * - 'good'        — score > 7  (good performance)
 *
 * @typedef {'significant' | 'moderate' | 'good'} ScoreBand
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/occupational-therapy-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} nhsNumber          - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName        - "Surname, Given" display name
 * @property {number} performanceScore   - COPM performance score, 1-10
 * @property {number} satisfactionScore  - COPM satisfaction score, 1-10
 * @property {string} primaryDiagnosis   - Primary diagnosis or referral reason
 * @property {string} priorityArea       - Highest-priority occupation area
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
// namespace, `window.OccupationalTherapyAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.OccupationalTherapyAssessmentDashboard`.
