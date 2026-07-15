// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Medical Certificate of Cause of Death
// (MCCD) dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Validity class emitted by the engine.
 * @typedef {'valid' | 'incomplete' | 'refer-to-coroner'} ValidityClass
 */

/**
 * Certificate row displayed in the certifier / medical-examiner dashboard.
 *
 * Mirrors `CertificateRow` in
 * `forms/medical-certificate-of-cause-of-death/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} CertificateRow
 * @property {string} id                             - UUID of the certificate record
 * @property {string} patientIdentifier              - NHS number or local identifier
 * @property {string} deceasedName                   - "Surname, Given" display name
 * @property {ValidityClass} validityClass           - valid | incomplete | refer-to-coroner
 * @property {string} underlyingCause                - lowest completed Part I line ('' when empty)
 * @property {boolean} coronerReferralIndicated      - a coroner-referral criterion is met
 * @property {string} certifyingDoctorName           - certifying doctor
 * @property {string} updatedAt                      - ISO date the record was last updated
 */

/**
 * Response from `GET /api/dashboard/certificates`.
 * @typedef {Object} DashboardCertificatesResponse
 * @property {CertificateRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.MedicalCertificateOfCauseOfDeathDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read the dashboard namespace.
