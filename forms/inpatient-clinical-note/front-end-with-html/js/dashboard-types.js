// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the ward dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Completeness status emitted by the completeness engine.
 *
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessStatus
 */

/**
 * Clinical acuity band emitted by the acuity engine.
 *
 * @typedef {'stable' | 'watch' | 'escalate' | 'critical'} AcuityBand
 */

/**
 * The eight note types a single admission episode can accrue.
 *
 * @typedef {'admission-clerking' | 'progress' | 'consult' | 'event' | 'procedure' | 'handover' | 'transfer' | 'discharge-planning'} NoteType
 */

/**
 * Inpatient-clinical-note row displayed in the ward dashboard.
 *
 * Mirrors `NoteRow` in
 * `forms/inpatient-clinical-note/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} NoteRow
 * @property {string} id                    - UUID of the note record
 * @property {string} hospitalMrn           - local patient identifier
 * @property {string} patientName           - "Surname, Given" display name
 * @property {string} wardName              - ward the patient is on
 * @property {NoteType} noteType            - which of the eight note types
 * @property {string} authorGrade           - grade of the note's author
 * @property {CompletenessStatus} status    - complete | partial | incomplete
 * @property {number} completenessPercent   - 0..100 across the required components
 * @property {AcuityBand} acuityBand        - final band, after any author override
 * @property {number | null} news2Total     - NEWS2 aggregate, null when not recorded
 * @property {boolean} safetyFlag           - true when a high-priority safety flag was raised
 * @property {number} lengthOfStayDays      - whole days since admission
 * @property {string} noteAt                - ISO date of the note (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/notes`.
 *
 * @typedef {Object} DashboardNotesResponse
 * @property {NoteRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only.
