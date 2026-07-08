// Plain-JavaScript / JSDoc type definitions for the WHO Surgical Safety
// Checklist review dashboard. Mirrors the SQL schema in
// `../../sql-migrations/04_create_table_who_surgical_safety_checklist.sql`
// and the team-member roster in `05_create_table_team_member.sql`.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Procedure urgency category (NCEPOD).
 *
 * @typedef {'elective' | 'urgent' | 'emergency' | 'immediate'} Urgency
 */

/**
 * Overall checklist lifecycle status.
 *
 * @typedef {'not-started'
 *   | 'sign-in-complete'
 *   | 'time-out-complete'
 *   | 'sign-out-complete'
 *   | 'completed'
 *   | 'abandoned'} ChecklistStatus
 */

/**
 * Surgical site laterality.
 *
 * @typedef {'left' | 'right' | 'bilateral' | 'midline' | 'na' | ''} Laterality
 */

/**
 * Team-member role on the operating-team roster.
 *
 * @typedef {'surgeon' | 'assistant-surgeon' | 'anaesthetist'
 *   | 'circulating-nurse' | 'scrub-nurse' | 'anaesthetic-assistant'
 *   | 'perfusionist' | 'technician' | 'observer' | 'other'} TeamRole
 */

/**
 * Team member captured during the Time Out introductions.
 *
 * @typedef {Object} TeamMember
 * @property {string}  name
 * @property {TeamRole} role
 * @property {'yes' | 'no' | ''} introducedDuringTimeOut
 */

/**
 * Phase 1 — Sign In items.
 *
 * @typedef {Object} SignInPhase
 * @property {'yes' | ''} identitySiteProcedureConsent
 * @property {'yes' | 'not-applicable' | ''} siteMarked
 * @property {'yes' | ''} anaesthesiaCheckComplete
 * @property {'yes' | ''} pulseOximeterOnPatient
 * @property {'no' | 'yes' | ''} knownAllergy
 * @property {string} knownAllergyDetail
 * @property {'no' | 'yes-equipment-available' | ''} difficultAirwayAspirationRisk
 * @property {'no' | 'yes-two-ivs-and-fluids-planned' | ''} bloodLossRisk
 * @property {string} coordinator
 * @property {string} completedAt
 */

/**
 * Phase 2 — Time Out items.
 *
 * @typedef {Object} TimeOutPhase
 * @property {'yes' | ''} teamIntroductionsConfirmed
 * @property {'yes' | ''} patientProcedureIncisionConfirmed
 * @property {'yes' | 'not-applicable' | ''} antibioticProphylaxisWithin60min
 * @property {string} surgeonCriticalSteps
 * @property {number | null} surgeonCaseDurationMinutes
 * @property {number | null} surgeonAnticipatedBloodLossMl
 * @property {string} anaesthetistPatientConcerns
 * @property {'yes' | ''} nursingSterilityConfirmed
 * @property {string} nursingEquipmentConcerns
 * @property {'yes' | 'not-applicable' | ''} essentialImagingDisplayed
 * @property {string} coordinator
 * @property {string} completedAt
 */

/**
 * Phase 3 — Sign Out items.
 *
 * @typedef {Object} SignOutPhase
 * @property {'yes' | ''} procedureNameConfirmed
 * @property {'yes' | 'no' | ''} countsConfirmed
 * @property {'yes' | 'no' | 'not-applicable' | ''} specimensLabelled
 * @property {string} equipmentProblems
 * @property {string} recoveryConcerns
 * @property {string} coordinator
 * @property {string} completedAt
 */

/**
 * Checklist row displayed in the review dashboard.
 *
 * @typedef {Object} ChecklistRow
 * @property {string} id              - UUID / case identifier
 * @property {string} caseDate        - ISO YYYY-MM-DD
 * @property {string} patient         - Patient display name
 * @property {string} site            - Hospital / facility name
 * @property {string} operatingRoom   - OR identifier
 * @property {string} plannedProcedure
 * @property {string} surgeon
 * @property {string} anaesthetist
 * @property {string} leadNurse
 * @property {Urgency} urgency
 * @property {string} specialty
 * @property {Laterality} laterality
 * @property {ChecklistStatus} status
 * @property {string[]} flags         - Kebab-case safety-flag identifiers
 * @property {SignInPhase} phase1
 * @property {TimeOutPhase} phase2
 * @property {SignOutPhase} phase3
 * @property {TeamMember[]} team
 * @property {string} abandonedReason - Free text, empty if not abandoned
 */

/**
 * Response from `GET /api/checklists`.
 *
 * Accepts either a bare array of `ChecklistRow` or a paginated
 * `{ items, total }` envelope for forwards compatibility.
 *
 * @typedef {ChecklistRow[] | { items: ChecklistRow[], total?: number }} DashboardChecklistsResponse
 */

// IIFE establishes the namespace so other classic <script> files can safely
// attach exports to `window.WhoSurgicalSafetyChecklistDashboard`.
(function () {
'use strict';
window.WhoSurgicalSafetyChecklistDashboard =
  window.WhoSurgicalSafetyChecklistDashboard || {};
})();
