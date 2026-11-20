// Plain-JavaScript / JSDoc type definitions for the United States Birth
// Certificate Application dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports.

/**
 * Application class emitted by the engine.
 * @typedef {'ready-to-submit' | 'incomplete' | 'ineligible-requester'} ApplicationClass
 */

/**
 * Application row displayed in the applications dashboard.
 *
 * Mirrors `ApplicationRow` in
 * `forms/united-states-birth-certificate-application/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ApplicationRow
 * @property {string} id                       - UUID of the application record
 * @property {string} registrantName           - "Surname, Given" of the person named
 * @property {string} birthState               - 2-letter code of the issuing state
 * @property {string} requesterRelationship    - relationship of the requester to the person named
 * @property {ApplicationClass} applicationClass
 * @property {boolean} ineligibleRequester     - the requester may not obtain a certified copy
 * @property {string} applicantName            - the requester
 * @property {string} updatedAt                - ISO date the record was last updated
 */

/**
 * Response from `GET /api/dashboard/applications`.
 * @typedef {Object} DashboardApplicationsResponse
 * @property {ApplicationRow[]} items
 * @property {number} total
 */
