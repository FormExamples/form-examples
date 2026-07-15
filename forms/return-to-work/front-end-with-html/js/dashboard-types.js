// Plain-JavaScript / JSDoc type definitions for the return-to-work
// clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Computed fitness statement (engine output; never blank).
 * @typedef {'fit' | 'may-be-fit' | 'not-fit'} FitnessStatement
 */

/**
 * Computed restriction-priority grade (engine output).
 * @typedef {'routine' | 'standard' | 'restricted' | 'high-risk'} RestrictionPriority
 */

/**
 * A row in the clinician dashboard, derived by running the shared engine.
 *
 * @typedef {Object} DashboardRow
 * @property {string} id                 - Record identifier (e.g. RTW-2026-0001)
 * @property {string} patientName        - Patient display name "Last, First"
 * @property {string} assessedDate       - ISO date "YYYY-MM-DD" of assessment
 * @property {FitnessStatement} fitnessStatement   - Final fitness statement
 * @property {RestrictionPriority} restrictionPriority - Max-grade priority
 * @property {boolean} phasedReturnFlag  - Whether a phased return applies
 * @property {number|null} daysAbsent    - Total calendar days absent
 * @property {number} flagCount          - Number of occupational-health flags
 */

/**
 * Response from `GET /api/return_to_works`.
 *
 * The Loco backend returns a bare JSON array of `DashboardRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {DashboardRow[] | { items: DashboardRow[], total?: number }} DashboardResponse
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ReturnToWorkDashboard`.
