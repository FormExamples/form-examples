// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * KDIGO GFR category labels (mL/min/1.73 m²).
 *   G1   >= 90
 *   G2   60-89
 *   G3a  45-59
 *   G3b  30-44
 *   G4   15-29
 *   G5   < 15  (kidney failure)
 *
 * @typedef {'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5'} GfrCategory
 */

/**
 * KDIGO albuminuria category labels (ACR mg/mmol).
 *   A1  < 3
 *   A2  3-30
 *   A3  > 30
 *
 * @typedef {'A1' | 'A2' | 'A3'} AlbuminuriaCategory
 */

/**
 * KDIGO composite risk band derived from the GFR x Albuminuria heatmap.
 *
 * @typedef {'Low' | 'Moderate' | 'High' | 'Very High'} CompositeRisk
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/renal-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} nhsNumber             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName           - "Surname, Given" display name
 * @property {number} egfr                  - eGFR in mL/min/1.73 m²
 * @property {GfrCategory} gfrCategory      - KDIGO GFR category (G1-G5)
 * @property {AlbuminuriaCategory} albuminuriaCategory - KDIGO albuminuria category (A1-A3)
 * @property {CompositeRisk} compositeRisk  - KDIGO composite risk band
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.RenalAssessmentDashboard`.
