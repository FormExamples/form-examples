// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United States Divorce Petition
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Readiness class emitted by the engine.
 * @typedef {'ready-to-file' | 'incomplete' | 'not-yet-eligible'} ReadinessClass
 */

/**
 * Petition row displayed in the petitions dashboard.
 *
 * Mirrors `PetitionRow` in
 * `forms/united-states-divorce-petition/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PetitionRow
 * @property {string} id                       - UUID of the petition record
 * @property {string} petitionerName           - petitioner
 * @property {string} respondentName           - respondent
 * @property {string} state                    - two-letter USPS code of the filing state
 * @property {string} caseType                 - uncontested | contested
 * @property {ReadinessClass} readinessClass   - ready-to-file | incomplete | not-yet-eligible
 * @property {string | null} earliestDecreeDate - ISO date; null when not determinable
 * @property {string} updatedAt                - ISO date the record was last updated
 */

/**
 * Response from `GET /api/dashboard/petitions`.
 * @typedef {Object} DashboardPetitionsResponse
 * @property {PetitionRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
