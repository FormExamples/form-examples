// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Overall film-reading outcome.
 *
 * @typedef {'normal-routine-recall' | 'technical-repeat' | 'recall-for-assessment' | ''} ReadingOutcome
 */

/**
 * Five-point breast imaging classification, or null when not yet assessed.
 *
 * @typedef {1 | 2 | 3 | 4 | 5 | null} ImagingClassification
 */

/**
 * Outcome band emitted by the classification engine.
 *
 * @typedef {'routine' | 'repeat' | 'assessment' | 'urgent' | 'referral' | 'incomplete'} OutcomeBand
 */

/**
 * Screening record row displayed in the clinician dashboard.
 *
 * Mirrors `ScreeningRow` in
 * `forms/breast-screening/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ScreeningRow
 * @property {string} id                          - UUID of the screening record
 * @property {string} patientIdentifier           - NHS number / local identifier
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {string} screeningUnit               - static or mobile unit
 * @property {ReadingOutcome} readingOutcome      - overall reading outcome
 * @property {ImagingClassification} imagingClassification - assessment class 1–5 or null
 * @property {OutcomeBand} outcomeBand            - derived outcome band
 * @property {boolean} urgentFlag                 - true for urgent / referral bands
 * @property {string} reportedAt                  - ISO date reported (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/screenings`.
 *
 * @typedef {Object} DashboardScreeningsResponse
 * @property {ScreeningRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.BreastScreeningDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.BreastScreeningDashboard`.
