// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/data/sample.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * ASA Physical Status grade — Roman-numeral string emitted by the scoring
 * engine. I = a normal healthy patient through VI = a declared brain-dead
 * patient whose organs are being removed for donor purposes.
 *
 * @typedef {'I' | 'II' | 'III' | 'IV' | 'V' | 'VI'} AsaGrade
 */

/**
 * Composite perioperative risk band emitted by the engine's max-grade
 * algorithm.
 *
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} CompositeRisk
 */

/**
 * Surgical urgency category. Mirrors the NCEPOD classification used in the
 * 16-step clinician wizard.
 *
 * @typedef {'elective' | 'urgent' | 'emergency' | 'immediate'} Urgency
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/pre-operative-assessment-by-clinician/front-end-with-svelte/src/lib/data/sample.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id           - UUID / case identifier of the assessment
 * @property {string} date         - ISO date "YYYY-MM-DD" of the assessment
 * @property {string} patient      - Patient display name
 * @property {string} nhs          - NHS number, formatted "NNN NNN NNNN"
 * @property {string} procedure    - Planned surgical procedure
 * @property {Urgency} urgency     - Surgical urgency category
 * @property {AsaGrade} asa        - Computed ASA Physical Status grade
 * @property {CompositeRisk} composite - Composite perioperative risk band
 * @property {number} rcri         - Revised Cardiac Risk Index, 0..6
 * @property {number} stopbang     - STOP-BANG OSA risk, 0..8
 * @property {number | null} cfs   - Clinical Frailty Scale, 1..9 (null when not assessed)
 * @property {string[]} flags      - Safety flags (kebab-case identifiers)
 * @property {string} clinician    - Signing clinician display name
 */

/**
 * Response from `GET /api/assessments`.
 *
 * The Loco backend returns a bare JSON array of `AssessmentRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {AssessmentRow[] | { items: AssessmentRow[], total?: number }} DashboardAssessmentsResponse
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.PreOperativeAssessmentByClinicianDashboard`.
