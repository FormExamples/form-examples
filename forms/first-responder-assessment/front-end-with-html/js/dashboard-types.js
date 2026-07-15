// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// First Responder Assessment data model for the management dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Readiness-level labels — derived from the engine's overall fitness
 * decision, presented in display form. Used both as filter values and as
 * the badge label.
 *
 * @typedef {'Fit for Duty' | 'Fit with Restrictions' | 'Temporarily Unfit' | 'Permanently Unfit'} ReadinessLevel
 */

/**
 * Competency-level labels emitted by the scoring engine
 * (`CompetencyLevel` in `engine/types.ts`), presented in display form.
 *
 * @typedef {'Expert' | 'Competent' | 'Developing' | 'Not Competent'} CompetencyLevel
 */

/**
 * Training-currency status, summarising whether the responder's mandatory
 * recertifications (BLS, ALS, manual handling, safeguarding, infection
 * control) are in date.
 *
 * @typedef {'Current' | 'Due Soon' | 'Overdue'} TrainingStatus
 */

/**
 * Display name for the responder's primary role. Mirrors the engine's
 * `RoleQualifications.roleType` enum, expanded to include the public-facing
 * variants the management dashboard cares about.
 *
 * @typedef {'Paramedic' | 'Advanced Paramedic' | 'EMT' | 'Community First Responder' | 'First Aider' | 'Lifeguard' | 'Military Medic'} RoleType
 */

/**
 * Responder row displayed in the management dashboard.
 *
 * Mirrors the responder list item that the SvelteKit dashboard would render
 * — one assessment record per responder, with computed readiness level,
 * competency level, role, training currency, and last call-out date.
 *
 * @typedef {Object} ResponderRow
 * @property {string} id                          - UUID of the assessment record
 * @property {string} registrationNumber          - HCPC / employer registration ID
 * @property {string} responderName               - "Surname, Given" display name
 * @property {RoleType} roleType                  - Primary responder role
 * @property {CompetencyLevel} competencyLevel    - Worst domain competency level
 * @property {ReadinessLevel} readinessLevel      - Overall fitness decision in display form
 * @property {TrainingStatus} trainingStatus      - Recertification currency status
 * @property {string} lastCallOutDate             - ISO 8601 date (YYYY-MM-DD) of last operational call-out
 * @property {number} yearsOfService              - Whole-number years of service
 */

/**
 * Response from `GET /api/dashboard/responders`.
 *
 * @typedef {Object} DashboardRespondersResponse
 * @property {ResponderRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.FirstResponderAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this
// file is unambiguously side-effecting and other files can rely on it
// loading before they read `window.FirstResponderAssessmentDashboard`.
