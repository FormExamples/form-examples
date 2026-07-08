// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Clavien-Dindo classification grade — match the strings emitted by the
 * scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Grade 0' | 'Grade I' | 'Grade II' | 'Grade IIIa' | 'Grade IIIb' | 'Grade IVa' | 'Grade IVb' | 'Grade V'} ClavienDindoGrade
 */

/**
 * Immediate post-operative disposition emitted by the form.
 *
 * @typedef {'Recovery' | 'Ward' | 'HDU' | 'ICU' | 'Discharged' | 'Deceased'} Disposition
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/post-operative-report/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the operation-note record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName              - "Surname, Given" display name
 * @property {string} procedureName            - Short procedure description
 * @property {string} procedureCategory        - Surgical specialty / category
 * @property {string} surgeon                  - Lead surgeon "Surname, Given"
 * @property {string} operationDate            - ISO 8601 date "YYYY-MM-DD"
 * @property {number} estimatedBloodLossMl     - Estimated blood loss in millilitres
 * @property {ClavienDindoGrade} clavienDindoGrade - Complication grade
 * @property {Disposition} disposition         - Immediate post-op disposition
 * @property {boolean} flagged                 - True when one or more issues were flagged
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
// namespace, `window.PostOperativeReportDashboard`.
(function () {
'use strict';
window.PostOperativeReportDashboard = window.PostOperativeReportDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.PostOperativeReportDashboard`.
})();
