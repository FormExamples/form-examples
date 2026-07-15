// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Overall NIPE screening outcome emitted by the classification engine.
 *
 * @typedef {'satisfactory' | 'refer' | 'incomplete'} OverallOutcome
 */

/**
 * Screening context in which the examination was performed.
 *
 * @typedef {'newborn-72h' | 'infant-6-8-week'} ExaminationContext
 */

/**
 * Care setting where the examination was performed.
 *
 * @typedef {'maternity-ward' | 'neonatal-unit' | 'community' | 'gp-surgery' | 'home' | 'other'} CareSetting
 */

/**
 * Examination row displayed in the clinician dashboard.
 *
 * Mirrors `ExaminationRow` in
 * `forms/newborn-and-infant-physical-examination/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ExaminationRow
 * @property {string} id                  - UUID of the examination record
 * @property {string} babyIdentifier      - NHS number or local identifier
 * @property {string} babyName            - baby display name
 * @property {CareSetting} careSetting     - where the examination was performed
 * @property {ExaminationContext} examinationContext - newborn-72h | infant-6-8-week
 * @property {OverallOutcome} overallOutcome - satisfactory | refer | incomplete
 * @property {boolean} referralFlag       - true when any key component classed Refer
 * @property {string} examinedAt          - ISO date of examination (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/examinations`.
 *
 * @typedef {Object} DashboardExaminationsResponse
 * @property {ExaminationRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.NewbornAndInfantPhysicalExaminationDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.NewbornAndInfantPhysicalExaminationDashboard`.
