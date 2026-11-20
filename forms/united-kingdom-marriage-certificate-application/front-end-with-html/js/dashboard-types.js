// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the United Kingdom Marriage Certificate Application
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Validity class emitted by the engine.
 * @typedef {'ready-to-submit' | 'incomplete' | 'needs-evidence' | 'ineligible'} ValidityClass
 */

/**
 * Application row displayed in the register-office dashboard.
 *
 * Mirrors `CertificateRow` in
 * `forms/united-kingdom-marriage-certificate-application/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} CertificateRow
 * @property {string} id                             - UUID of the application record
 * @property {string} reference                       - application reference
 * @property {string} partyNames                      - "First party and Second party" display name
 * @property {ValidityClass} validityClass           - ready-to-submit | incomplete | needs-evidence | ineligible
 * @property {string} ceremonyDate                    - planned ceremony date ('' when unset)
 * @property {boolean} immigrationReferralIndicated  - an immigration referral is indicated
 * @property {string} registrationDistrict            - registration district
 * @property {string} updatedAt                      - ISO date the record was last updated
 */

/**
 * Response from `GET /api/united-kingdom-marriage-certificate-application/dashboard/certificates`.
 * @typedef {Object} DashboardCertificatesResponse
 * @property {CertificateRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read the dashboard namespace.
