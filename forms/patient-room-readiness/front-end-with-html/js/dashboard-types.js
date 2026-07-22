// Plain-JavaScript / JSDoc type definitions for the Patient Room Readiness
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Checklist row displayed in the dashboard.
 *
 * Mirrors `ChecklistRow` in
 * `forms/patient-room-readiness/front-end-with-svelte/src/lib/data/sample.ts`.
 *
 * @typedef {Object} ChecklistRow
 * @property {string} id             - UUID / case identifier of the checklist
 * @property {string} date           - ISO date "YYYY-MM-DD" of the inspection
 * @property {string} building       - Building name/number
 * @property {string} room           - Room name/number
 * @property {number} checkedCount   - Number of checkpoints confirmed
 * @property {number} totalCount     - Total checkpoints (25)
 * @property {string} inspector      - Inspector display name
 */

/**
 * Response from `GET /api/patient-room-readiness-checklists`.
 *
 * The Loco backend returns a bare JSON array of `ChecklistRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {ChecklistRow[] | { items: ChecklistRow[], total?: number }} DashboardChecklistsResponse
 */
