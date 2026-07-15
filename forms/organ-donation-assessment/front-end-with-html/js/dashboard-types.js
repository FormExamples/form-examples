// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Donor eligibility classification — match the strings emitted by the
 * scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Suitable' | 'Conditionally Suitable' | 'Unsuitable'} Eligibility
 */

/**
 * Donor risk-level band emitted by the scoring engine.
 *
 * @typedef {'Low' | 'Moderate' | 'High' | 'Critical'} RiskLevel
 */

/**
 * Donor type. `Living` covers kidney and partial-liver donations from
 * living donors. `DBD` (donation after brain death) and `DCD` (donation
 * after circulatory death) are the two deceased-donor pathways.
 *
 * @typedef {'Living' | 'DBD' | 'DCD'} DonorType
 */

/**
 * Solid organ being offered for donation. Matches the organ list in
 * `forms/organ-donation-assessment/AGENTS.md`.
 *
 * @typedef {'Kidney' | 'Liver' | 'Heart' | 'Lung' | 'Pancreas' | 'Intestine'} Organ
 */

/**
 * ABO blood-group compatibility between donor and recipient.
 * - `Compatible`     : identical or universally accepted (e.g. O to A)
 * - `Incompatible`   : ABO mismatch requiring desensitisation or rejection
 *
 * @typedef {'Compatible' | 'Incompatible'} AboCompatibility
 */

/**
 * HLA match grade displayed in the dashboard. `<7/10` covers all matches
 * with fewer than seven matching alleles.
 *
 * @typedef {'10/10' | '9/10' | '8/10' | '7/10' | '<7/10'} HlaMatch
 */

/**
 * Donor row displayed in the clinician dashboard.
 *
 * Mirrors `DonorRow` in
 * `forms/organ-donation-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} DonorRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} nhsNumber             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} donorName             - "Surname, Given" display name
 * @property {DonorType} donorType          - Living, DBD, or DCD
 * @property {Organ} organ                  - Organ offered for donation
 * @property {AboCompatibility} aboCompatibility - ABO compatibility flag
 * @property {HlaMatch} hlaMatch            - HLA match grade (matched alleles out of 10)
 * @property {Eligibility} eligibility      - Donor eligibility classification
 * @property {RiskLevel} riskLevel          - Donor risk-level band
 */

/**
 * Response from `GET /api/dashboard/donors`.
 *
 * @typedef {Object} DashboardDonorsResponse
 * @property {DonorRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.OrganDonationAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.OrganDonationAssessmentDashboard`.
