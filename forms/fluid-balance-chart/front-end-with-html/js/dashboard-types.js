// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Fluid Balance Chart clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Fluid-status classification emitted by the engine.
 * @typedef {'balanced' | 'positive' | 'negative' | 'oliguria'} FluidStatus
 */

/**
 * Charting-clinician role.
 * @typedef {'nurse' | 'doctor' | 'healthcare-assistant' | 'other'} ClinicianRole
 */

/**
 * Chart row displayed in the clinician dashboard.
 *
 * Mirrors `ChartRow` in
 * `forms/fluid-balance-chart/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ChartRow
 * @property {string} id                              - UUID of the chart record
 * @property {string} patientIdentifier               - local patient identifier
 * @property {string} patientName                     - "Surname, Given" display name
 * @property {string} wardOrUnit                      - ward or unit name
 * @property {number} totalIntakeMl                   - Σ intake volumes (mL)
 * @property {number} totalOutputMl                   - Σ output volumes (mL)
 * @property {number} netBalanceMl                    - intake − output (mL)
 * @property {number | null} urineOutputRateMlPerKgPerHour - mL/kg/h, or null
 * @property {FluidStatus} fluidStatus                - balanced | positive | negative | oliguria
 * @property {string} chartStartAt                    - ISO date the chart started (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/charts`.
 *
 * @typedef {Object} DashboardChartsResponse
 * @property {ChartRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules). The IIFE attaches its public symbols to a single
// global namespace, `window.FluidBalanceChartDashboard`.
(function () {
'use strict';
window.FluidBalanceChartDashboard =
  window.FluidBalanceChartDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.FluidBalanceChartDashboard`.
})();
