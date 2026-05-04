// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the safety officer dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * HSE Workplace Safety Audit outcome labels — match the strings emitted by
 * the scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Compliant' | 'Minor Findings' | 'Major Findings' | 'Critical Findings'} Outcome
 */

/**
 * Healthcare site type covered by the audit. Drives the site-type filter
 * dropdown and the per-row site-type badge.
 *
 * @typedef {'NHS Hospital' | 'GP Practice' | 'Mental Health Unit' | 'Dental Practice' | 'Community Pharmacy' | 'Ambulance Station' | 'Care Home' | 'Hospice'} SiteType
 */

/**
 * Site row displayed in the safety officer dashboard.
 *
 * Mirrors `SiteRow` in
 * `forms/workplace-safety-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} SiteRow
 * @property {string} id              - UUID of the audit record
 * @property {string} siteName        - Display name of the site
 * @property {string} location        - City / region
 * @property {SiteType} siteType      - Healthcare site category
 * @property {Outcome} outcome        - Audit outcome category
 * @property {string} lastAuditDate   - ISO 8601 date (YYYY-MM-DD) of the last audit
 * @property {number} openActions     - Count of open corrective actions
 * @property {string} auditor         - Name of the auditor of record
 */

/**
 * Response from `GET /api/dashboard/sites`.
 *
 * @typedef {Object} DashboardSitesResponse
 * @property {SiteRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.WorkplaceSafetyAssessmentDashboard`.
(function () {
'use strict';
window.WorkplaceSafetyAssessmentDashboard =
  window.WorkplaceSafetyAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.WorkplaceSafetyAssessmentDashboard`.
})();
