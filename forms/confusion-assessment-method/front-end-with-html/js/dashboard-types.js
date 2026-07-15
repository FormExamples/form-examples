// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.
//
// CAM is a status / classification form: the dashboard shows a classification
// (present / absent / unable-to-assess), not a numeric score.

/**
 * Derived CAM classification emitted by the engine, or null when not yet
 * graded. Kebab-case strings matching the SQL and the SvelteKit dashboard so
 * the same backend payload can drive either UI without translation.
 *
 * @typedef {'present' | 'absent' | 'unable-to-assess' | null} Classification
 */

/**
 * CAM variant used for the assessment.
 *
 * @typedef {'cam' | 'cam-icu'} CamVariant
 */

/**
 * Psychomotor subtype of delirium.
 *
 * @typedef {'hypoactive' | 'hyperactive' | 'mixed' | 'normal' | ''} MotoricSubtype
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/confusion-assessment-method/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {string} wardUnit           - ward or unit where assessed
 * @property {CamVariant} camVariant     - assessment variant
 * @property {Classification} classification - derived CAM classification
 * @property {MotoricSubtype} motoricSubtype - psychomotor subtype
 * @property {boolean} deliriumFlag      - true when classification == 'present'
 * @property {string} assessedAt         - ISO date of assessment (yyyy-mm-dd)
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
// namespace, `window.ConfusionAssessmentMethodDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ConfusionAssessmentMethodDashboard`.
