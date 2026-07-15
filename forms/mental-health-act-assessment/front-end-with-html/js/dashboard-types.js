// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Mental Health Act Assessment dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Legal-completeness status emitted by the engine.
 * @typedef {'valid' | 'incomplete'} CompletenessStatus
 */

/**
 * Recommended-section classification emitted by the engine.
 * @typedef {'section-2' | 'section-3' | 'section-4' | 'section-5-2' | 'section-5-4' | 'section-136' | 'none'} RecommendedSectionClass
 */

/**
 * Urgency classification emitted by the engine.
 * @typedef {'routine' | 'urgent' | 'emergency'} UrgencyClass
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/mental-health-act-assessment/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                                 - UUID of the assessment record
 * @property {string} patientIdentifier                  - NHS number or local identifier
 * @property {string} personName                         - "Surname, Given" display name
 * @property {CompletenessStatus} completenessStatus     - valid | incomplete
 * @property {RecommendedSectionClass} recommendedSectionClass
 * @property {UrgencyClass} urgency                      - routine | urgent | emergency
 * @property {string} amhpName                           - coordinating AMHP
 * @property {string} updatedAt                          - ISO date the record was last updated
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read the dashboard namespace.
