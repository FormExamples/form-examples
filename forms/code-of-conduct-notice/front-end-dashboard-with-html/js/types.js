// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the compliance dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Acknowledgement status values — match the strings emitted by the
 * compliance back-end. Used both as filter values and as the badge label.
 *
 * - Acknowledged: recipient has signed and dated the current notice
 * - Pending:      notice issued, awaiting recipient action, not yet overdue
 * - Overdue:      notice issued more than the configured grace period ago
 * - Declined:     recipient has explicitly refused to acknowledge
 *
 * @typedef {'Acknowledged' | 'Pending' | 'Overdue' | 'Declined'} AcknowledgementStatus
 */

/**
 * Department buckets used by the compliance dashboard.
 *
 * @typedef {'Nursing' | 'Medical' | 'Admin' | 'Allied Health' | 'IT' | 'Pharmacy'} Department
 */

/**
 * Training currency band derived from the most recent code-of-conduct
 * training completion date.
 *
 * - Current:  completed within the last 12 months
 * - Due Soon: completed 11-12 months ago (renewal window)
 * - Expired:  completed more than 12 months ago, or never
 *
 * @typedef {'Current' | 'Due Soon' | 'Expired'} TrainingCurrency
 */

/**
 * Staff row displayed in the compliance dashboard.
 *
 * Mirrors `StaffRow` in
 * `forms/code-of-conduct-notice/front-end-dashboard-with-svelte/src/lib/types.ts`
 * (when that module is created). Field naming follows project camelCase
 * convention.
 *
 * @typedef {Object} StaffRow
 * @property {string} id                              - UUID of the staff record
 * @property {string} employeeId                      - Employer-issued identifier (display form)
 * @property {string} staffName                       - "Surname, Given" display name
 * @property {Department} department                  - Departmental bucket
 * @property {string} role                            - Job title (free text)
 * @property {AcknowledgementStatus} acknowledgementStatus - Sign-off state
 * @property {string} lastSignOffDate                 - ISO yyyy-mm-dd or '' if never signed
 * @property {boolean} conflictOfInterestDeclared     - True if recipient declared any COI
 * @property {TrainingCurrency} trainingCurrency      - Training currency band
 */

/**
 * Response from `GET /api/dashboard/staff`.
 *
 * @typedef {Object} DashboardStaffResponse
 * @property {StaffRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.CodeOfConductNoticeDashboard`.
(function () {
'use strict';
window.CodeOfConductNoticeDashboard = window.CodeOfConductNoticeDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.CodeOfConductNoticeDashboard`.
})();
