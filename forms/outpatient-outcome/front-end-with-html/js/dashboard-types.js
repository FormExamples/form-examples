// Plain-JavaScript / JSDoc type definitions for the outpatient outcome
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Domain / overall grade emitted by the OOCG engine ('' = insufficient data).
 * @typedef {'A' | 'B' | 'C' | 'D' | 'E' | ''} DomainGrade
 */

/**
 * A row in the outpatient outcome dashboard, derived by running the shared
 * OOCG engine over an assessment.
 *
 * @typedef {Object} OutcomeRow
 * @property {string} id                - Report identifier
 * @property {string} patientName       - Patient display name "Family, Given"
 * @property {string} assessedDate      - ISO clinic date "YYYY-MM-DD"
 * @property {string} specialty         - Clinic specialty
 * @property {string} modality          - Encounter modality (snake_case)
 * @property {number|null} waitTimeDays - Referral-to-appointment wait in days
 * @property {DomainGrade} overallGrade - Overall OOCG grade (worst of four)
 * @property {DomainGrade} clinicalGrade
 * @property {DomainGrade} promGrade
 * @property {DomainGrade} premGrade
 * @property {DomainGrade} operationalGrade
 * @property {number} flagCount         - Number of flagged issues
 */

/**
 * Response from `GET /api/outpatient_outcomes`.
 *
 * The Loco backend returns a bare JSON array of `OutcomeRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {OutcomeRow[] | { items: OutcomeRow[], total?: number }} DashboardOutcomesResponse
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.OutpatientOutcomeDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.OutpatientOutcomeDashboard`.
