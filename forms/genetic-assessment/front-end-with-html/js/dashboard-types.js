// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Risk stratification level emitted by the genetic risk grader.
 *
 *   0-2  = Low      (routine follow-up)
 *   3-5  = Moderate (genetic counselling recommended)
 *   6+   = High     (urgent genetic counselling referral)
 *
 * @typedef {'Low' | 'Moderate' | 'High'} RiskLevel
 */

/**
 * Presenting concern categories used for triage. These map onto the major
 * clinical-genetics referral pathways covered by the assessment instrument.
 *
 * @typedef {'Breast/Ovarian Cancer' | 'Colorectal/Lynch' | 'Cardiovascular' | 'Neurological' | 'Paediatric' | 'Reproductive'} PresentingConcern
 */

/**
 * Recommended next-step pathway for the proband.
 *
 * @typedef {'Routine follow-up' | 'Genetic counselling' | 'Urgent counselling' | 'Panel testing' | 'Predictive testing'} Recommendation
 */

/**
 * Patient (proband) row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/genetic-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`,
 * extended with the clinical fields surfaced in the HTML dashboard:
 * weighted risk score, family-history affected count, and Manchester Score
 * (BRCA) where applicable.
 *
 * Manchester Score is only meaningful for breast/ovarian referrals; for
 * other concerns it is `null`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName              - "Surname, Given" display name
 * @property {RiskLevel} riskLevel             - Risk stratification band
 * @property {number} riskScore                - Weighted risk score (0-20+)
 * @property {PresentingConcern} presentingConcern - Triage category
 * @property {number} familyAffectedCount      - Count of affected first/second-degree relatives
 * @property {number | null} manchesterScore   - Manchester Score for BRCA (null if not applicable)
 * @property {Recommendation} recommendation   - Recommended next-step pathway
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
// namespace, `window.GeneticAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.GeneticAssessmentDashboard`.
