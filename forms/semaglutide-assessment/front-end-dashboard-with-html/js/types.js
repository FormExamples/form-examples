// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Eligibility status emitted by the eligibility-grader engine.
 *
 *   - 'Eligible'    — no contraindications and BMI/indication thresholds met
 *   - 'Conditional' — relative contraindications fired or BMI borderline;
 *                     requires additional clinical judgement / monitoring
 *   - 'Ineligible'  — at least one absolute contraindication fired
 *
 * @typedef {'Eligible' | 'Conditional' | 'Ineligible'} Eligibility
 */

/**
 * BMI category band derived from `kg / m^2`. Mirrors WHO classification
 * with a finer-grained split at the GLP-1 weight-management thresholds
 * (>=27 with comorbidity, >=30 unconditional).
 *
 * @typedef {'Underweight' | 'Normal' | 'Overweight' | 'Pre-Obesity' | 'Obesity I' | 'Obesity II' | 'Obesity III'} BmiBand
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/semaglutide-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`,
 * extended with the comorbidity and exclusion flags surfaced in the table.
 *
 * @typedef {Object} PatientRow
 * @property {string}      id                       - UUID of the assessment record
 * @property {string}      nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string}      patientName              - "Surname, Given" display name
 * @property {Eligibility} eligibilityStatus        - GLP-1 eligibility verdict
 * @property {string}      primaryIndication        - "Type 2 Diabetes" | "Weight Management" | "Cardiovascular Risk Reduction"
 * @property {number}      bmi                      - Body-mass index, kg/m^2
 * @property {BmiBand}     bmiBand                  - BMI categorical band
 * @property {number|null} weightLossTargetPercent  - Patient's stated weight-loss goal as percent of body weight, or null
 * @property {boolean}     comorbidityT2DM          - Type 2 diabetes mellitus
 * @property {boolean}     comorbidityHypertension  - Diagnosed hypertension
 * @property {boolean}     comorbidityDyslipidaemia - Diagnosed dyslipidaemia
 * @property {boolean}     comorbidityOSA           - Obstructive sleep apnoea
 * @property {boolean}     exclusionPregnancy       - Currently pregnant or planning pregnancy
 * @property {boolean}     exclusionMTC             - Personal/family history of MTC or MEN2
 * @property {boolean}     exclusionSevereGI        - Gastroparesis or other severe GI disease
 * @property {boolean}     exclusionHypersensitivity - Known allergy/hypersensitivity to semaglutide
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number}       total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.SemaglutideAssessmentDashboard`.
(function () {
'use strict';
window.SemaglutideAssessmentDashboard = window.SemaglutideAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.SemaglutideAssessmentDashboard`.
})();
