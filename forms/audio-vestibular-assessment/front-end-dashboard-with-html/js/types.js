// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * WHO pure-tone audiometry hearing-loss grades — match the strings emitted
 * by the scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Normal' | 'Mild' | 'Moderate' | 'Moderately Severe' | 'Severe' | 'Profound'} HearingLossGrade
 */

/**
 * Dizziness Handicap Inventory (DHI) handicap level.
 *
 * @typedef {'No Handicap' | 'Mild' | 'Moderate' | 'Severe'} DhiHandicapLevel
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/audio-vestibular-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                         - UUID of the assessment record
 * @property {string} nhsNumber                  - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName                - "Surname, Given" display name
 * @property {HearingLossGrade} hearingLossGrade - WHO grade for the worse ear
 * @property {number} dhiScore                   - DHI total score, 0-100
 * @property {DhiHandicapLevel} dhiHandicapLevel - DHI handicap category
 * @property {boolean} vestibularFlag            - True when vestibular screening positive
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
// namespace, `window.AudioVestibularAssessmentDashboard`.
(function () {
'use strict';
window.AudioVestibularAssessmentDashboard =
  window.AudioVestibularAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AudioVestibularAssessmentDashboard`.
})();
