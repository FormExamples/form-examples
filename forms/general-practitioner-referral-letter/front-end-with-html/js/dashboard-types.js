// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the General Practitioner Referral Letter
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Documentation-completeness status emitted by the engine.
 *
 * @typedef {'Complete' | 'Incomplete'} Status
 */

/**
 * Urgency classification echoed by the engine; routes the referral to its
 * pathway (routine / urgent / two-week-wait suspected cancer / emergency).
 *
 * @typedef {'routine' | 'urgent' | 'two-week-wait' | 'emergency' | ''} Urgency
 */

/**
 * Referral row displayed in the dashboard.
 *
 * Mirrors `ReferralRow` in
 * `forms/general-practitioner-referral-letter/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ReferralRow
 * @property {string} id                      - UUID of the referral record
 * @property {string} patientIdentifier       - NHS number or local identifier
 * @property {string} patientName             - "Surname, Given" display name
 * @property {string} referralSpecialty       - specialty / service referred to
 * @property {Status} status                  - Complete | Incomplete
 * @property {number} completenessPercent     - 0..100
 * @property {Urgency} urgency                - routine | urgent | two-week-wait | emergency
 * @property {boolean} redFlag                - true when emergency features are present
 * @property {string} referrerName            - clinician who made the referral
 * @property {string} referralDate            - ISO date the referral was made
 */

/**
 * Response from `GET /api/dashboard/referrals`.
 *
 * @typedef {Object} DashboardReferralsResponse
 * @property {ReferralRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.GeneralPractitionerReferralLetterDashboard`.
(function () {
'use strict';
window.GeneralPractitionerReferralLetterDashboard =
  window.GeneralPractitionerReferralLetterDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read the dashboard namespace.
})();
