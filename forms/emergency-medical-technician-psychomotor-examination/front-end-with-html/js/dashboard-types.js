// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the NREMT Psychomotor Skills
// Examination training coordinator dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * NREMT Psychomotor Skills Examination overall outcome.
 *
 * A candidate is recorded as `Pass` only when they meet the minimum point
 * threshold AND no critical criterion was triggered. Any single
 * critical-criteria failure forces an automatic `Fail` regardless of the
 * point total.
 *
 * @typedef {'Pass' | 'Fail'} Outcome
 */

/**
 * Categorised label for the kind of NREMT critical criterion that was
 * triggered. Used in the dashboard's critical-reason column so coordinators
 * can see at a glance why a candidate failed without opening the full
 * record. Matches the eight critical-criteria buckets called out in the
 * NREMT Psychomotor Examination guidance:
 *
 *   - PPE                  - failure to take body-substance-isolation precautions
 *   - Scene Safety         - failure to determine scene safety
 *   - Oxygen               - failure to voice and provide high-concentration oxygen
 *   - Airway / Breathing   - failure to manage the airway, breathing, or shock
 *   - Transport Decision   - failure to differentiate transport urgency
 *   - Dangerous Intervention - ordering an intervention that would harm the patient
 *   - Spinal Protection    - failure to provide spinal protection when indicated
 *   - Transport Call       - failure to initiate or call for transport within 15 minutes
 *
 * Empty string when no critical criterion was triggered.
 *
 * @typedef {'' | 'PPE' | 'Scene Safety' | 'Oxygen' | 'Airway / Breathing' | 'Transport Decision' | 'Dangerous Intervention' | 'Spinal Protection' | 'Transport Call'} CriticalCriterion
 */

/**
 * Candidate row displayed in the training coordinator dashboard.
 *
 * Mirrors `CandidateRow` in
 * `forms/emergency-medical-technician-psychomotor-examination/front-end-dashboard-with-svelte/src/lib/types.ts`
 * (when that SvelteKit dashboard is generated).
 *
 * @typedef {Object} CandidateRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} candidateId              - Internal candidate identifier (e.g. "EMT-2026-0017")
 * @property {string} candidateName            - "Surname, Given" display name
 * @property {Outcome} outcome                 - Overall NREMT psychomotor outcome
 * @property {boolean} criticalFailure         - True when any critical criterion was triggered
 * @property {CriticalCriterion} criticalReason - Categorised critical-criterion bucket (empty when no critical failure)
 * @property {number} pointsEarned             - Points awarded on the patient-assessment checklist
 * @property {number} pointsPossible           - Total points possible (typically 48 for medical, 50 for trauma; ~50 overall)
 * @property {number} minimumPassingPoints     - Minimum points required for a Pass at this station
 * @property {string} examDate                 - ISO date "YYYY-MM-DD" of the practical examination
 * @property {string} examinerName             - Certifying NREMT-approved examiner "Surname, Given"
 * @property {string} program                  - EMS training program / NREMT testing-station name
 * @property {string} stationType              - NREMT station type (e.g. "Patient Assessment - Medical")
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
// `window.EmergencyMedicalTechnicianPsychomotorExaminationDashboard`.
