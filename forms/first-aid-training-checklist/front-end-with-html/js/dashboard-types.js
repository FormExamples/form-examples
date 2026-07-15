// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the First Aid at Work training
// coordinator dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * UK HSE First Aid at Work overall outcome.
 *
 * @typedef {'Pass' | 'Needs Development' | 'Fail'} Outcome
 */

/**
 * Workplace role / cohort. Roles that commonly require an HSE-approved
 * First Aid at Work certificate.
 *
 * @typedef {'Designated First Aider' | 'Manager' | 'Lifeguard' | 'School Teacher' | 'Security Officer' | 'Hotel Staff' | 'Factory Worker' | 'NHS Reception'} TraineeRole
 */

/**
 * Computed certification-currency band derived from the certificate's
 * expiry date relative to "today":
 *   - Current        — expires more than 60 days from now
 *   - Expiring Soon  — expires within 60 days (inclusive)
 *   - Expired        — expiry date has passed
 *
 * @typedef {'Current' | 'Expiring Soon' | 'Expired'} CertificationCurrency
 */

/**
 * Trainee row displayed in the training coordinator dashboard.
 *
 * Mirrors `TraineeRow` in
 * `forms/first-aid-training-checklist/front-end-dashboard-with-svelte/src/lib/types.ts`
 * (when that SvelteKit dashboard is generated).
 *
 * @typedef {Object} TraineeRow
 * @property {string} id                      - UUID of the assessment record
 * @property {string} traineeId               - Internal trainee/staff identifier (e.g. "FAW-2026-0017")
 * @property {string} traineeName             - "Surname, Given" display name
 * @property {TraineeRole} role               - Trainee workplace role
 * @property {Outcome} outcome                - Overall HSE FAW outcome
 * @property {number} skillsPassed            - Count of competency skills demonstrated to standard
 * @property {number} skillsTotal             - Total number of competency skills assessed
 * @property {string} certificationIssued     - ISO date "YYYY-MM-DD" of certificate issue (empty string if Fail)
 * @property {string} certificationExpiry     - ISO date "YYYY-MM-DD" of certificate expiry (empty string if Fail)
 * @property {CertificationCurrency} certificationCurrency - Computed currency band
 * @property {string} assessorName            - Approved assessor "Surname, Given"
 * @property {string} trainingCentre          - Training-centre / approved provider name
 */

/**
 * Response from `GET /api/dashboard/trainees`.
 *
 * @typedef {Object} DashboardTraineesResponse
 * @property {TraineeRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.FirstAidTrainingChecklistDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this
// file is unambiguously side-effecting and other files can rely on it
// loading before they read
// `window.FirstAidTrainingChecklistDashboard`.
