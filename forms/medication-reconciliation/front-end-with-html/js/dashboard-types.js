// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Medication Reconciliation clinician
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Overall reconciliation status emitted by the engine.
 * @typedef {'complete' | 'discrepancies-outstanding' | 'incomplete'} ReconciliationStatus
 */

/**
 * Transition of care at which the reconciliation is performed.
 * @typedef {'admission' | 'transfer' | 'discharge'} ReconciliationType
 */

/**
 * Care setting where the reconciliation was performed.
 * @typedef {'emergency-department' | 'acute-medical-unit' | 'surgical-admissions' | 'ward' | 'critical-care' | 'other'} CareSetting
 */

/**
 * Reconciliation row displayed in the clinician dashboard.
 *
 * Mirrors `ReconciliationRow` in
 * `forms/medication-reconciliation/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ReconciliationRow
 * @property {string} id                          - UUID of the reconciliation record
 * @property {string} patientIdentifier           - local patient identifier
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {ReconciliationType} reconciliationType - admission | transfer | discharge
 * @property {CareSetting} careSetting            - where the reconciliation was performed
 * @property {number} sourceCount                 - number of information sources
 * @property {number} discrepancyCount            - total discrepancies
 * @property {number} unintentionalCount          - outstanding (unintentional) discrepancies
 * @property {ReconciliationStatus} status        - complete | discrepancies-outstanding | incomplete
 * @property {string} reconciledAt                - ISO date of reconciliation (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/reconciliations`.
 *
 * @typedef {Object} DashboardReconciliationsResponse
 * @property {ReconciliationRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules). The IIFE attaches its public symbols to a single
// global namespace, `window.MedicationReconciliationDashboard`.
(function () {
'use strict';
window.MedicationReconciliationDashboard =
  window.MedicationReconciliationDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.MedicationReconciliationDashboard`.
})();
