// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the screening dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Overall screening outcome emitted by the classification engine.
 * @typedef {'all-not-suspected' | 'referral-required' | 'repeat-required' | 'incomplete' | 'declined-only-outstanding'} OverallOutcome
 */

/**
 * Referral status derived from the overall outcome.
 * @typedef {'routine' | 'repeat' | 'urgent'} ReferralStatus
 */

/**
 * Screening row displayed in the dashboard.
 *
 * @typedef {Object} ScreeningRow
 * @property {string} id                 - UUID of the screening record
 * @property {string} nhsNumber          - baby's NHS number, "NNN NNN NNNN"
 * @property {string} babyName           - baby's name (may be provisional)
 * @property {OverallOutcome} overallOutcome - overall screening outcome
 * @property {ReferralStatus} referralStatus - referral status
 * @property {number | null} ageAtSampleDays - age in days at sampling, or null
 * @property {boolean} sampleAdequate    - true when the sample was adequate
 * @property {number} suspectedCount     - number of suspected conditions
 * @property {boolean} carrierFlag       - true when SCD carrier detected
 */

/**
 * Response from `GET /api/dashboard/screenings`.
 *
 * @typedef {Object} DashboardScreeningsResponse
 * @property {ScreeningRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.NewbornBloodSpotScreeningDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.NewbornBloodSpotScreeningDashboard`.
