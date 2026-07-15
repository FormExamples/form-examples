// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.
//
// The Ottawa Knee Rule is a DECISION RULE, not a score: each row carries a
// binary imaging decision (X-ray indicated / not indicated), not a total.

/**
 * Binary imaging decision emitted by the decision engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation.
 *
 * @typedef {'xray-indicated' | 'xray-not-indicated'} Decision
 */

/**
 * Whether a knee radiograph is indicated (yes when any one criterion fires).
 *
 * @typedef {'yes' | 'no' | ''} XrayIndicated
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'emergency-department' | 'minor-injuries-unit' | 'urgent-care' | 'other'} CareSetting
 */

/**
 * Side of the injured knee.
 *
 * @typedef {'left' | 'right' | ''} InjuredSide
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/ottawa-knee-rule/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {InjuredSide} injuredSide    - injured knee side
 * @property {number} firedCount          - number of criteria present (0..5)
 * @property {XrayIndicated} xrayIndicated - whether imaging is indicated
 * @property {Decision} decision          - derived imaging decision
 * @property {string} assessedAt          - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.OttawaKneeRuleDashboard`.
