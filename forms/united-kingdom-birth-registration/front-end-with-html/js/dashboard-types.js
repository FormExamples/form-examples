// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United Kingdom Birth Registration
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Readiness class emitted by the engine.
 * @typedef {'ready-to-submit' | 'incomplete' | 'needs-additional-evidence' | 'out-of-scope'} ReadinessClass
 */

/**
 * Application row displayed in the registrar dashboard.
 *
 * Mirrors `RegistrationRow` in
 * `forms/united-kingdom-birth-registration/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} RegistrationRow
 * @property {string} id                       - UUID of the application record
 * @property {string} reference                - application reference
 * @property {string} childName                - "Surname, Forenames" display name
 * @property {ReadinessClass} readinessClass   - ready-to-submit | incomplete | needs-additional-evidence | out-of-scope
 * @property {number | null} daysSinceBirth    - whole days from birth to registration; null when unknown
 * @property {boolean} lateRegistration        - registration after the 42-day period
 * @property {string} informantName            - the informant
 * @property {string} updatedAt                - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-kingdom-birth-registration/dashboard/registrations`.
 * @typedef {Object} DashboardRegistrationsResponse
 * @property {RegistrationRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
