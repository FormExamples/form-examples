// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Genetics Assessment clinician
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Risk stratification level emitted by the genetics-grader (NICE CG164).
 *
 *   Low      = routine surveillance, no testing indicated
 *   Moderate = genetic counselling + targeted scoring tools
 *   High     = urgent counselling and panel testing referral
 *
 * @typedef {'Low' | 'Moderate' | 'High'} RiskLevel
 */

/**
 * Presenting concern categories used for triage. These map onto the major
 * clinical-genetics referral pathways covered by the assessment instrument.
 *
 *   BRCA / HBOC   = hereditary breast / ovarian cancer (Manchester, Tyrer-Cuzick)
 *   Lynch / HNPCC = hereditary non-polyposis colorectal cancer (Bethesda, PREMM5)
 *   Paediatric    = developmental, dysmorphology, syndromic referrals
 *   Neurogenetic  = HD, ataxias, hereditary neuropathies, etc.
 *   Reproductive  = preconception / carrier-screening pathway
 *
 * @typedef {'BRCA / HBOC' | 'Lynch / HNPCC' | 'Paediatric' | 'Neurogenetic' | 'Reproductive'} PresentingConcern
 */

/**
 * Bethesda-criteria outcome for Lynch syndrome screening.
 *
 *   'Met'     = revised Bethesda guidelines satisfied; MMR/MSI testing indicated
 *   'Not Met' = criteria not satisfied
 *   'N/A'     = proband is not a Lynch / HNPCC referral
 *
 * @typedef {'Met' | 'Not Met' | 'N/A'} BethesdaResult
 */

/**
 * Recommended next-step testing pathway for the proband.
 *
 * @typedef {(
 *   'BRCA1/2 panel'
 *   | 'HBOC extended panel'
 *   | 'Lynch / MMR panel'
 *   | 'Whole-exome sequencing'
 *   | 'Targeted neurogenetic panel'
 *   | 'Carrier screening'
 *   | 'Predictive testing'
 *   | 'No testing indicated'
 * )} RecommendedTesting
 */

/**
 * Patient (proband) row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/genetics-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * Targeted-scoring fields are only meaningful for the relevant referral
 * pathway:
 *   - `manchesterScore`      — BRCA / HBOC (range ~0-50; >=15 supports testing)
 *   - `tyrerCuzickLifetime`  — BRCA / HBOC (lifetime breast-cancer risk %)
 *   - `bethesdaResult`       — Lynch / HNPCC (Met / Not Met)
 *   - `premm5Percent`        — Lynch / HNPCC (predicted MMR mutation %)
 *
 * Each is `null` (numeric) or `'N/A'` (categorical) when not applicable.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                                   - UUID of the assessment record
 * @property {string} nhsNumber                            - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName                          - "Surname, Given" display name
 * @property {RiskLevel} riskLevel                         - Risk stratification band
 * @property {PresentingConcern} presentingConcern         - Triage category
 * @property {number | null} manchesterScore               - Manchester Score for BRCA (null if not applicable)
 * @property {number | null} tyrerCuzickLifetime           - Tyrer-Cuzick lifetime breast-cancer risk percent (null if not applicable)
 * @property {BethesdaResult} bethesdaResult               - Bethesda criteria outcome ('N/A' if not Lynch)
 * @property {number | null} premm5Percent                 - PREMM5 percent MMR-mutation probability (null if not applicable)
 * @property {RecommendedTesting} recommendedTesting       - Recommended testing pathway
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// (Note the trailing 's' — this is the *Genetics* dashboard, not the related
// *Genetic* one.)

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.GeneticsAssessmentDashboard`.
