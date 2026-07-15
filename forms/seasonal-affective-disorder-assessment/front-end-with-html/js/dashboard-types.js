// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Combined severity classification — derived from the SPAQ GSS band and the
 * PHQ-9 band, plus suicidal-ideation escalation. Used both as filter values
 * and as the badge label.
 *
 * @typedef {'no-sad' | 'mild' | 'moderate' | 'severe' | 'critical'} CombinedSeverity
 */

/**
 * Seasonal pattern reported by the patient.
 *
 * @typedef {'Winter' | 'Summer' | 'Non-seasonal'} SeasonalPattern
 */

/**
 * Current treatment status. Captures the modality currently in place; "None"
 * means the patient is untreated.
 *
 * @typedef {'None' | 'Light Therapy' | 'SSRI' | 'CBT'} TreatmentStatus
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/seasonal-affective-disorder-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                          - UUID of the assessment record
 * @property {string} nhsNumber                   - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {number} gssScore                    - SPAQ Global Seasonality Score, 0-24
 * @property {number} phq9Score                   - PHQ-9 depression severity score, 0-27
 * @property {CombinedSeverity} combinedSeverity  - Combined severity classification
 * @property {SeasonalPattern} seasonalPattern    - Reported seasonal pattern
 * @property {TreatmentStatus} treatmentStatus    - Current treatment modality
 * @property {boolean} suicidalRiskFlag           - True when patient endorses suicidal ideation
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.SeasonalAffectiveDisorderAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.SeasonalAffectiveDisorderAssessmentDashboard`.
