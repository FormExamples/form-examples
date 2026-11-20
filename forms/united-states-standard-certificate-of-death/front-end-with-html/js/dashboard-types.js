// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the US Standard Certificate of Death
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Validity class emitted by the engine.
 * @typedef {'valid' | 'incomplete' | 'refer-to-medical-examiner-or-coroner'} ValidityClass
 */

/**
 * Certificate row displayed in the certifier / medical-examiner dashboard.
 *
 * Mirrors `CertificateRow` in
 * `forms/united-states-standard-certificate-of-death/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} CertificateRow
 * @property {string} id                             - UUID of the certificate record
 * @property {string} stateFileNumber              - state file number or local case number
 * @property {string} decedentName                   - "Surname, Given" display name
 * @property {ValidityClass} validityClass           - valid | incomplete | refer-to-medical-examiner-or-coroner
 * @property {string} underlyingCause                - lowest completed Part I line ('' when empty)
 * @property {boolean} referralIndicated      - a medical examiner or coroner referral criterion is met
 * @property {string} certifierName           - certifier
 * @property {string} updatedAt                      - ISO date the record was last updated
 */

/**
 * Response from `GET /api/dashboard/certificates`.
 * @typedef {Object} DashboardCertificatesResponse
 * @property {CertificateRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read the dashboard namespace.
