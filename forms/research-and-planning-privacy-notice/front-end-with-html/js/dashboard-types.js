// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the compliance dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Aggregate opt-in status displayed in the "Opt-In Status" column.
 *
 * Derived from the two boolean axes recorded by the recipient form
 * (NHS Type 1 opt-out and National Data Opt-Out) plus the
 * AcknowledgementSignature.agreed flag:
 *
 * - 'Opted In':         agreed and neither opt-out asserted
 * - 'Type 1 Opt-Out':   only Type 1 opt-out asserted (local research/planning)
 * - 'National Opt-Out': only National Data Opt-Out asserted
 * - 'Both Opt-Outs':    both opt-outs asserted (strongest dissent)
 * - 'Not Recorded':     patient has not yet submitted a preference
 *
 * @typedef {'Opted In' | 'Type 1 Opt-Out' | 'National Opt-Out' | 'Both Opt-Outs' | 'Not Recorded'} OptInStatus
 */

/**
 * UK GDPR Article 6 / DPA 2018 lawful basis under which the patient's
 * confidential information is processed for research and service planning.
 *
 * - 'Public Task':     Article 6(1)(e) — performance of a task in the public
 *                      interest (the default basis for NHS research and
 *                      planning under the Health Service (Control of Patient
 *                      Information) Regulations 2002).
 * - 'Consent':         Article 6(1)(a) — explicit patient consent.
 * - 'Vital Interests': Article 6(1)(d) — protection of the vital interests
 *                      of the data subject or another person.
 *
 * @typedef {'Public Task' | 'Consent' | 'Vital Interests'} LawfulBasis
 */

/**
 * Validator output for a recipient submission.
 *
 * - 'Complete':   Acknowledgement, signature, opt-out preferences, and
 *                 recipient details all present.
 * - 'Incomplete': One or more required acknowledgement fields missing.
 *
 * @typedef {'Complete' | 'Incomplete'} CompletionStatus
 */

/**
 * Patient row displayed in the compliance dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/research-and-planning-privacy-notice/front-end-dashboard-with-svelte/src/lib/types.ts`
 * (when that module is created). Field naming follows project camelCase
 * convention. The two boolean opt-out axes (`type1OptOut`,
 * `nationalDataOptOut`) come straight from the recipient form's
 * `AcknowledgementSignature` shape; `optInStatus` is the derived,
 * dashboard-friendly aggregate.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                      - UUID of the recipient record
 * @property {string} nhsNumber               - 10-digit NHS number (display form)
 * @property {string} patientName             - "Surname, Given" display name
 * @property {string} organisationName        - Issuing organisation
 * @property {OptInStatus} optInStatus        - Aggregated opt-in / opt-out posture
 * @property {boolean} type1OptOut            - True if NHS Type 1 opt-out asserted
 * @property {boolean} nationalDataOptOut     - True if National Data Opt-Out asserted
 * @property {LawfulBasis} lawfulBasis        - UK GDPR Art.6 / DPA 2018 basis
 * @property {CompletionStatus} completionStatus - Validator state
 * @property {string} acknowledgementDate     - ISO yyyy-mm-dd or '' if unsigned
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.ResearchAndPlanningPrivacyNoticeDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ResearchAndPlanningPrivacyNoticeDashboard`.
