// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United Kingdom death registration
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Registration class emitted by the engine.
 * @typedef {'ready-to-register' | 'incomplete' | 'referred-to-coroner-pending' | 'registered'} RegistrationClass
 */

/**
 * Deadline status of the 5-day registration window.
 * @typedef {'not-started' | 'paused-coroner' | 'on-track' | 'due-soon' | 'overdue' | 'registered' | 'registered-late'} DeadlineStatus
 */

/**
 * Registration row displayed in the family / registrar dashboard.
 *
 * Mirrors `RegistrationRow` in
 * `forms/united-kingdom-death-registration/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} RegistrationRow
 * @property {string} id                         - UUID of the registration record
 * @property {string} deceasedName               - "Surname, Given" display name
 * @property {RegistrationClass} registrationClass
 * @property {DeadlineStatus} deadlineStatus
 * @property {number | null} daysSinceConfirmation - days since the medical examiner confirmed; null when unconfirmed
 * @property {string} informantName              - person registering the death
 * @property {boolean} informantQualified        - a qualified informant under section 16
 * @property {string} updatedAt                  - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-kingdom-death-registration/dashboard/registrations`.
 * @typedef {Object} DashboardRegistrationsResponse
 * @property {RegistrationRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
