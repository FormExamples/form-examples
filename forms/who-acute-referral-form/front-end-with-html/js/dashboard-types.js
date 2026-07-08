// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Mode of inter-facility transport. Empty string means "not yet recorded".
 *
 * @typedef {'road' | 'air' | 'sea' | ''} ModeOfTransfer
 */

/**
 * Transfer status across the two-party WHO Acute Referral lifecycle:
 *  - 'initiated'        — referral created at the initiating facility
 *  - 'in-transit'       — patient en route, not yet arrived
 *  - 'arrived'          — patient received at the referral facility
 *  - 'feedback-received'— receiving facility returned feedback to sender
 *
 * @typedef {'initiated' | 'in-transit' | 'arrived' | 'feedback-received'} TransferStatus
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/who-acute-referral-form/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the referral record
 * @property {string} patientName              - "Surname, Given" display name
 * @property {string} dateOfBirth              - ISO-8601 date "YYYY-MM-DD"
 * @property {string} sex                      - "F" | "M" | other free-text
 * @property {string} initiatingFacility       - Facility referring the patient
 * @property {string} referralFacility         - Receiving facility
 * @property {ModeOfTransfer} modeOfTransfer
 * @property {string} primaryDiagnosis         - Free-text clinical diagnosis
 * @property {TransferStatus} transferStatus
 * @property {number} urgentFlagCount          - Number of active urgent flags
 * @property {string} departureTime            - ISO-8601 timestamp
 * @property {string | null} arrivalTime       - ISO-8601 timestamp or null
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
// namespace, `window.WhoAcuteReferralDashboard`.
(function () {
'use strict';
window.WhoAcuteReferralDashboard = window.WhoAcuteReferralDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.WhoAcuteReferralDashboard`.
})();
