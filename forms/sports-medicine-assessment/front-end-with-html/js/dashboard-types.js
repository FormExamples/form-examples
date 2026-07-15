// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * PPE 5th-edition clearance categories — match the strings emitted by the
 * scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Cleared' | 'Cleared with Conditions' | 'Not Cleared Pending Further Evaluation' | 'Not Cleared for Sport'} Clearance
 */

/**
 * Sport-contact level per AAP/PPE classification. Drives both filtering and
 * the contact-level badge colour.
 *
 * @typedef {'Contact' | 'Limited Contact' | 'Non-Contact'} SportContactLevel
 */

/**
 * Coarse age band used for cohort analysis on the dashboard. Derived from
 * the athlete's age at evaluation.
 *
 * @typedef {'Youth' | 'Adolescent' | 'Adult' | 'Masters'} AgeBand
 */

/**
 * Athlete row displayed in the clinician dashboard.
 *
 * Mirrors `AthleteRow` in
 * `forms/sports-medicine-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AthleteRow
 * @property {string}            id                     - UUID of the assessment record
 * @property {string}            nhsNumber              - NHS number, formatted "NNN NNN NNNN"
 * @property {string}            athleteName            - "Surname, Given" display name
 * @property {number}            age                    - Athlete age in years at evaluation
 * @property {AgeBand}           ageBand                - Coarse age cohort
 * @property {string}            sport                  - Primary sport (e.g. "Football", "Swimming")
 * @property {string}            position               - Position / event within the sport
 * @property {SportContactLevel} contactLevel           - Sport contact classification
 * @property {Clearance}         clearance              - PPE 5th-ed. clearance category
 * @property {boolean}           concussionHistory      - Prior concussion(s) reported
 * @property {boolean}           redS                   - Relative Energy Deficiency in Sport flag
 * @property {boolean}           familyCardiovascular   - Family history of premature CV disease / SCD
 */

/**
 * Response from `GET /api/dashboard/athletes`.
 *
 * @typedef {Object} DashboardAthletesResponse
 * @property {AthleteRow[]} items
 * @property {number}       total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.SportsMedicineAssessmentDashboard`.
