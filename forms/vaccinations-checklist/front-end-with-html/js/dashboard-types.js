// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Vaccination compliance category — matches the simplified three-state
 * dashboard taxonomy. The full engine in
 * `front-end-form-with-svelte/src/lib/engine/types.ts` distinguishes
 * `fully-immunised` / `partially-immunised` / `non-compliant` /
 * `contraindicated`; the dashboard rolls "fully-immunised" up to
 * `compliant` and "partially-immunised" / `contraindicated` to `partial`.
 *
 * @typedef {'compliant' | 'partial' | 'non-compliant'} Compliance
 */

/**
 * Age band — coarse grouping used for filtering rather than the precise
 * date-of-birth-derived value. The childhood band (0-18) maps to the
 * UK Green Book routine childhood schedule.
 *
 * @typedef {'Childhood (0-18)' | 'Adult (19-64)' | 'Older Adult (65+)'} AgeBand
 */

/**
 * UK Green Book schedule type that drove this patient's checklist.
 *
 * @typedef {'Childhood' | 'Adult' | 'Traveller' | 'Occupational'} ScheduleType
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors the conceptual `PatientRow` for the Vaccinations Checklist
 * dashboard. Backend (Loco/axum) emits this with `serde(rename_all =
 * "camelCase")`, so field names match exactly.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                     - UUID of the assessment record
 * @property {string} nhsNumber              - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName            - "Surname, Given" display name
 * @property {number} ageYears               - Patient's age in whole years
 * @property {AgeBand} ageBand               - Coarse age-band label
 * @property {ScheduleType} scheduleType     - Applicable Green Book schedule
 * @property {Compliance} compliance         - Roll-up compliance category
 * @property {string[]} missingVaccinations  - Outstanding vaccines (empty when compliant)
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
// before they read `window.VaccinationsChecklistDashboard`.
