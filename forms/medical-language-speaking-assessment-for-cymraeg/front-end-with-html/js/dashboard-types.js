// Plain-JavaScript / JSDoc type definitions for the Welsh-language (Cymraeg)
// clinical speaking sub-test (Medicine) admin dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Overall grade — the categorical band reported to candidates and to NHS
 * Wales workforce / regulatory bodies. Ranges from A (highest) to E
 * (lowest). C+ is a sub-band introduced to give finer resolution around the
 * registration / Welsh-essential-post threshold.
 *
 * Most NHS Wales Welsh-essential clinical posts (and most healthcare
 * regulators recognising Welsh-language proficiency under the NHS Wales
 * Welsh Language Standards / Iaith Gwaith framework) require a minimum of
 * B (350+) for sign-off as Welsh-language proficient.
 *
 * @typedef {'A' | 'B' | 'C+' | 'C' | 'D' | 'E'} Grade
 */

/**
 * Candidate's healthcare profession — drives the role-play scenario set
 * used during the Welsh-language speaking sub-test.
 *
 * @typedef {'Doctor' | 'Nurse' | 'Pharmacist' | 'Dentist' | 'Physiotherapist'} Profession
 */

/**
 * Outcome of the candidate's onward Welsh-language sign-off / registration
 * application with the relevant NHS Wales / regulatory body (downstream of
 * the speaking sitting itself).
 *
 * @typedef {'Eligible' | 'Not Eligible' | 'Pending'} RegistrationOutcome
 */

/**
 * Candidate row displayed in the admin dashboard.
 *
 * Mirrors `CandidateRow` in
 * `forms/medical-language-speaking-assessment-for-cymraeg/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} CandidateRow
 * @property {string} id                              - UUID of the assessment record
 * @property {string} candidateNumber                 - Candidate number, e.g. "CYM-2026-00417"
 * @property {string} candidateName                   - "Surname, Given" display name
 * @property {Profession} profession                  - Candidate's healthcare profession
 * @property {number} scaledScore                     - Overall scaled score, 0-500
 * @property {Grade} grade                            - Overall Welsh-language speaking grade
 * @property {string} examiner                        - Examiner display name
 * @property {string} sittingDate                     - Sitting date, ISO 8601 (YYYY-MM-DD)
 * @property {RegistrationOutcome} registrationOutcome - Onward registration / sign-off outcome
 */

/**
 * Response from `GET /api/dashboard/candidates`.
 *
 * @typedef {Object} DashboardCandidatesResponse
 * @property {CandidateRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.MedicalLanguageSpeakingAssessmentForCymraegDashboard`.
