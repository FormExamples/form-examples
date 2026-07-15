// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the BLS training coordinator dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * AHA BLS Skills Verification overall outcome.
 *
 * @typedef {'Pass' | 'Fail'} Outcome
 */

/**
 * Trainee role / cohort. NHS and allied-services roles that commonly
 * require BLS certification.
 *
 * @typedef {'Nurse' | 'Doctor' | 'Healthcare Assistant' | 'Lifeguard' | 'Manual Handler' | 'Security Officer'} TraineeRole
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
 * `forms/cardiopulmonary-resuscitation-training/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} TraineeRow
 * @property {string} id                      - UUID of the assessment record
 * @property {string} traineeId               - Internal trainee/staff identifier (e.g. "BLS-2026-0017")
 * @property {string} traineeName             - "Surname, Given" display name
 * @property {TraineeRole} role               - Trainee professional role
 * @property {Outcome} outcome                - Overall AHA BLS outcome
 * @property {boolean} criticalActionFailure  - True when any critical action (compressions, ventilations, AED safety) failed
 * @property {number} compressionRate         - Average chest-compression rate in compressions/minute
 * @property {number} compressionDepthCm      - Average compression depth in centimetres
 * @property {string} certificationIssued     - ISO date "YYYY-MM-DD" of certificate issue (empty string if Fail)
 * @property {string} certificationExpiry     - ISO date "YYYY-MM-DD" of certificate expiry (empty string if Fail)
 * @property {CertificationCurrency} certificationCurrency - Computed currency band
 * @property {string} instructorName          - Certifying instructor "Surname, Given"
 * @property {string} trainingCentre          - Training-centre name (NHS trust / academy)
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
// namespace, `window.CardiopulmonaryResuscitationTrainingDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this
// file is unambiguously side-effecting and other files can rely on it
// loading before they read
// `window.CardiopulmonaryResuscitationTrainingDashboard`.
