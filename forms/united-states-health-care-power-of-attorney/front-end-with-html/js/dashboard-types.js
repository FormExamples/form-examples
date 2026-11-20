// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United States Health Care Power of
// Attorney reviewer dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Readiness class emitted by the engine.
 * @typedef {'ready-to-execute' | 'incomplete' | 'execution-risk'} ReadinessClass
 */

/**
 * Directive row displayed in the reviewer dashboard.
 *
 * Mirrors `DirectiveRow` in
 * `forms/united-states-health-care-power-of-attorney/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} DirectiveRow
 * @property {string} id                       - UUID of the directive record
 * @property {string} state                    - two-letter state of the principal
 * @property {string} principalName            - principal display name
 * @property {ReadinessClass} readinessClass   - ready-to-execute | incomplete | execution-risk
 * @property {string} agentName                - named health care agent ('' when none)
 * @property {boolean} executionRisk           - an execution defect could invalidate the document
 * @property {string} reviewerName             - reviewing attorney or staff member
 * @property {string} updatedAt                - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-states-health-care-power-of-attorney/dashboard/directives`.
 * @typedef {Object} DashboardDirectivesResponse
 * @property {DirectiveRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
