// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/data/sample.ts` data model for the theatre dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Composite operative risk band emitted by the engine's max-grade algorithm.
 * Routine is the default when no rules fire.
 *
 * @typedef {'routine' | 'complicated' | 'high-risk' | 'critical'} CompositeRisk
 */

/**
 * Clavien-Dindo classification of surgical complications. '0' represents the
 * default no-complication state; I through V follow Ann Surg 2004; 240:205.
 *
 * @typedef {'0' | 'I' | 'II' | 'IIIa' | 'IIIb' | 'IVa' | 'IVb' | 'V'} ClavienDindoGrade
 */

/**
 * NCEPOD Classification of Intervention - surgical urgency category.
 *
 * @typedef {'elective' | 'scheduled' | 'urgent' | 'immediate'} Urgency
 */

/**
 * Theatre list type carried over from booking. Drives reporting cohorts.
 *
 * @typedef {'elective' | 'CEPOD' | 'trauma' | 'obstetric' | 'day-case'} ListType
 */

/**
 * Post-op recovery destination from step 11 of the op-note wizard.
 *
 * @typedef {'PACU' | 'ward' | 'enhanced-care' | 'HDU' | 'ICU' | 'day-case-discharge'} RecoveryDestination
 */

/**
 * Operation-note row displayed in the theatre dashboard.
 *
 * Mirrors `OperationNoteRow` in
 * `forms/medical-operation-note/front-end-dashboard-with-svelte/src/lib/data/sample.ts`.
 *
 * @typedef {Object} OperationNoteRow
 * @property {string}              id                  - UUID / case identifier
 * @property {string}              date                - ISO date "YYYY-MM-DD" of the case
 * @property {string}              hospital            - Hospital / trust name
 * @property {string}              theatre             - Theatre / OR number or label
 * @property {ListType}            listType            - Theatre list type
 * @property {string}              surgeon             - Lead surgeon display name
 * @property {string}              patient             - Anonymised patient label
 * @property {string}              nhs                 - NHS number, formatted "NNN NNN NNNN"
 * @property {string}              procedure           - Primary procedure performed
 * @property {string}              opcs                - Primary OPCS-4 code
 * @property {Urgency}             urgency             - NCEPOD urgency category
 * @property {CompositeRisk}       compositeRisk       - Composite operative risk band
 * @property {ClavienDindoGrade}   clavienDindo        - Clavien-Dindo grade
 * @property {number}              estimatedBloodLoss  - Estimated blood loss (mL)
 * @property {boolean}             countsAgreed        - Swab / needle / instrument counts agreed
 * @property {boolean}             neverEventFlag      - Any never-event candidate flagged
 * @property {RecoveryDestination} recoveryDestination - Post-op recovery destination
 * @property {boolean}             signed              - Electronic signature recorded
 */

/**
 * Response from `GET /api/operation-notes`.
 *
 * The Loco backend returns a bare JSON array of `OperationNoteRow` objects;
 * the dashboard accepts either a bare array or an `{ items, total }` envelope
 * so future paginated responses are forwards-compatible.
 *
 * @typedef {OperationNoteRow[] | { items: OperationNoteRow[], total?: number }} DashboardOperationNotesResponse
 */

// Wrapped in an IIFE so locals stay scoped - this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.MedicalOperationNoteDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.MedicalOperationNoteDashboard`.
