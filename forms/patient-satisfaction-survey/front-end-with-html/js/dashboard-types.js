// Plain-JavaScript / JSDoc type definitions for the Patient Satisfaction
// Survey clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.
//
// The shape mirrors the scoring system documented in the parent
// `index.md`: a normalized 0-100 composite score split into five ordered
// satisfaction categories.

/**
 * Satisfaction category labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Excellent' | 'Good' | 'Satisfactory' | 'Poor' | 'Very Poor'} SatisfactionCategory
 */

/**
 * Visit department / care setting captured in step 2 (Visit Details).
 *
 * @typedef {'General Practice' | 'Emergency' | 'Outpatient' | 'Inpatient' | 'Day Surgery' | 'Maternity'} VisitDepartment
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors the `PatientRow` shape that the SvelteKit dashboard would use
 * once the engine is wired up.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                          - UUID of the survey record
 * @property {string} nhsNumber                   - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {VisitDepartment} visitDepartment    - Department / care setting
 * @property {number} satisfactionScore           - Normalized composite, 0-100
 * @property {SatisfactionCategory} satisfactionCategory - Banded category
 * @property {boolean} recommendFlag              - True when patient would recommend
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
// before they read `window.PatientSatisfactionSurveyDashboard`.
