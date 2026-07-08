// Plain-JavaScript / JSDoc type definitions for the arc42 architecture
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Maturity band emitted by the engine's max-grade algorithm.
 * @typedef {'draft' | 'reviewable' | 'ready' | 'mature' | ''} Maturity
 */

/**
 * Sign-off recommendation captured in step 12.
 * @typedef {'proceed' | 'revise-first' | 'block' | ''} Recommendation
 */

/**
 * Document row displayed in the architecture dashboard.
 *
 * @typedef {Object} DashboardRow
 * @property {string} id                 - Stable document identifier
 * @property {string} name               - Architecture name
 * @property {string} owner              - Owning team / person
 * @property {string} updatedDate        - ISO date "YYYY-MM-DD" last updated
 * @property {Maturity} maturity         - Final maturity band from the engine
 * @property {number} sectionsComplete   - Count of the 12 sections graded complete
 * @property {number} flagCount          - Number of flagged issues
 * @property {Recommendation} recommendation - Sign-off recommendation
 */

/**
 * Response from `GET /api/arc42_documentations`.
 *
 * The Loco backend returns a bare JSON array of `DashboardRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {DashboardRow[] | { items: DashboardRow[], total?: number }} DashboardDocumentsResponse
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.Arc42Dashboard`.
(function () {
'use strict';
window.Arc42Dashboard =
  window.Arc42Dashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.Arc42Dashboard`.
})();
