// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the RLSS NPLQ / ILSF Lifeguard
// Competency Verification training coordinator dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Lifeguard Competency Verification overall outcome.
 *
 * - Pass: All competencies demonstrated to standard
 * - Needs Development: Minor deficiencies; targeted retraining required
 * - Fail: Critical-competency failure (timed swim, unconscious-casualty
 *   rescue, spinal handling, CPR depth/rate, AED delivery, scanning
 *   effectiveness)
 *
 * @typedef {'Pass' | 'Needs Development' | 'Fail'} Outcome
 */

/**
 * Aquatic venue type at which the candidate operates / was assessed.
 *
 * @typedef {'Pool' | 'Beach' | 'Leisure Centre' | 'Water Park' | 'Lido' | 'Hotel Pool'} VenueType
 */

/**
 * Computed certification-currency band derived from the certificate's
 * expiry date relative to "today":
 *   - Current        — expires more than 60 days from now
 *   - Expiring Soon  — expires within 60 days (inclusive)
 *   - Expired        — expiry date has passed
 *
 * Standard NPLQ certification validity is two years; CPR refresher is
 * required annually (tracked separately via `cprRefresherDue`).
 *
 * @typedef {'Current' | 'Expiring Soon' | 'Expired'} CertificationCurrency
 */

/**
 * Candidate row displayed in the training coordinator dashboard.
 *
 * Mirrors `CandidateRow` in
 * `forms/lifeguard-certification-checklist/front-end-dashboard-with-svelte/src/lib/types.ts`
 * (when that SvelteKit dashboard is generated).
 *
 * @typedef {Object} CandidateRow
 * @property {string} id                      - UUID of the assessment record
 * @property {string} candidateId             - Internal candidate identifier (e.g. "NPLQ-2026-0017")
 * @property {string} candidateName           - "Surname, Given" display name
 * @property {VenueType} venueType            - Aquatic venue type
 * @property {string} venueName               - Specific venue / employer name
 * @property {Outcome} outcome                - Overall NPLQ / ILSF outcome
 * @property {boolean} criticalCompetencyFailure - True when any critical competency failed
 * @property {number} timedSwimSeconds        - Best 100 m timed-swim seconds (NPLQ standard ≤ 100 s)
 * @property {number} competenciesPassed      - Count of competency areas demonstrated to standard
 * @property {number} competenciesTotal       - Total number of competency areas assessed (10)
 * @property {string} certificationIssued     - ISO date "YYYY-MM-DD" of certificate issue (empty string if Fail)
 * @property {string} certificationExpiry     - ISO date "YYYY-MM-DD" of certificate expiry (empty string if Fail)
 * @property {CertificationCurrency} certificationCurrency - Computed currency band
 * @property {string} cprRefresherDue         - ISO date "YYYY-MM-DD" of next annual CPR refresher (empty string if Fail)
 * @property {string} examinerName            - Approved examiner "Surname, Given"
 */

/**
 * Response from `GET /api/dashboard/candidates`.
 *
 * @typedef {Object} DashboardCandidatesResponse
 * @property {CandidateRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this
// file is unambiguously side-effecting and other files can rely on it
// loading before they read
// `window.LifeguardCertificationChecklistDashboard`.
