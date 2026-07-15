// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Maximum aortic diameter in centimetres, or null when not measured.
 *
 * @typedef {number | null} DiameterCm
 */

/**
 * Aneurysm category emitted by the classification engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation.
 *
 * @typedef {'normal' | 'small' | 'medium' | 'large' | 'non-visualised'} Category
 */

/**
 * Surveillance / referral band emitted by the classification engine.
 *
 * @typedef {'discharge' | 'annual' | 'three-monthly' | 'refer-vascular' | 'rescan'} SurveillanceBand
 */

/**
 * Screening-scan row displayed in the clinician dashboard.
 *
 * Mirrors `ScreeningRow` in
 * `forms/abdominal-aortic-aneurysm-screening/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ScreeningRow
 * @property {string} id                     - UUID of the screening record
 * @property {string} patientIdentifier      - local patient identifier
 * @property {string} patientName            - "Surname, Given" display name
 * @property {string} clinicSite             - clinic or site where the scan was performed
 * @property {DiameterCm} maxAorticDiameterCm - maximum aortic diameter (cm) or null
 * @property {Category} category             - derived aneurysm category
 * @property {SurveillanceBand} surveillanceBand - derived surveillance / referral band
 * @property {boolean} referralFlag          - true when a vascular referral is indicated (large or symptomatic aneurysm)
 * @property {string} scannedAt              - ISO date of the scan (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/screenings`.
 *
 * @typedef {Object} DashboardScreeningsResponse
 * @property {ScreeningRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.AbdominalAorticAneurysmScreeningDashboard`.
