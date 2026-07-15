// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Worst-eye retinopathy (R) grade emitted by the engine.
 *
 * @typedef {'R0' | 'R1' | 'R2' | 'R3S' | 'R3A'} RetinopathyGrade
 */

/**
 * Worst-eye maculopathy (M) grade emitted by the engine.
 *
 * @typedef {'M0' | 'M1'} MaculopathyGrade
 */

/**
 * Recall / referral outcome emitted by the engine.
 *
 * @typedef {'refer-hes-urgent' | 'refer-hes' | 'refer-slit-lamp'
 *   | 'surveillance-6-month' | 'routine-12-month' | 'routine-24-month'} Outcome
 */

/**
 * Referral destination emitted by the engine.
 *
 * @typedef {'none' | 'hes-routine' | 'hes-urgent' | 'slit-lamp'} Referral
 */

/**
 * Screening row displayed in the clinician dashboard.
 *
 * Mirrors `ScreeningRow` in
 * `forms/diabetic-eye-screening/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ScreeningRow
 * @property {string} id                    - UUID of the screening record
 * @property {string} patientIdentifier     - local / NHS patient identifier
 * @property {string} patientName           - "Surname, Given" display name
 * @property {RetinopathyGrade} worstRetinopathy - worst-eye retinopathy grade
 * @property {MaculopathyGrade} worstMaculopathy - worst-eye maculopathy grade
 * @property {Outcome} outcome              - recall / referral outcome
 * @property {Referral} referral            - referral destination
 * @property {boolean} urgentFlag           - true when urgent ophthalmology referral is indicated
 * @property {string} screenedAt            - ISO date of grading (yyyy-mm-dd)
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
// namespace, `window.DiabeticEyeScreeningDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.DiabeticEyeScreeningDashboard`.
