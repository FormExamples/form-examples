// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * MELD score (6–40), or null when a required input is missing.
 *
 * @typedef {number | null} MeldScore
 */

/**
 * Mortality band emitted by the MELD engine. Lower-case strings matching the
 * SvelteKit dashboard so the same backend payload can drive either UI without
 * translation.
 *
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | 'extreme' | ''} MortalityBand
 */

/**
 * Chosen MELD variant.
 *
 * @typedef {'meld' | 'meld-na' | 'meld-3'} MeldVariant
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'hepatology-clinic' | 'transplant-unit' | 'intensive-care' | 'ward' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/model-for-end-stage-liver-disease-score/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                     - UUID of the calculation record
 * @property {string} patientIdentifier      - local patient identifier
 * @property {string} patientName            - "Surname, Given" display name
 * @property {CareSetting} careSetting        - where the assessment was performed
 * @property {MeldVariant} meldVariant        - chosen instrument
 * @property {MeldScore} meldScore            - MELD score (6–40) or null
 * @property {MortalityBand} mortalityBand    - derived mortality band
 * @property {boolean} dialysisFlag           - true when the dialysis rule was applied
 * @property {string} assessedAt             - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.ModelForEndStageLiverDiseaseScoreDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ModelForEndStageLiverDiseaseScoreDashboard`.
