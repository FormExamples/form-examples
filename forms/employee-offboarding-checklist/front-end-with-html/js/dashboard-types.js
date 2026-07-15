// Plain-JavaScript / JSDoc type definitions for the HR / management
// dashboard data model.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.
//
// The shape mirrors the `ValidationResult` produced by the SvelteKit form's
// validation engine, projected into the row-level summary used by the
// dashboard table.

/**
 * Offboarding completion status — coarse-grained category produced by the
 * checklist validator. The dashboard surfaces these labels in the status
 * column / filter dropdown.
 *
 * - 'Complete'   — every mandatory item confirmed.
 * - 'Partial'    — non-blocking items outstanding; safe to release.
 * - 'Incomplete' — mandatory items outstanding; requires HR escalation.
 *
 * @typedef {'Complete' | 'Partial' | 'Incomplete'} CompletionStatus
 */

/**
 * Department grouping used in the dashboard filter and table column.
 *
 * @typedef {'Nursing' | 'Medical' | 'Admin' | 'Allied Health' | 'IT' | 'Pharmacy'} Department
 */

/**
 * Blocker category — the most-significant outstanding mandatory item that is
 * preventing the offboarding from being marked Complete. 'None' means no
 * blocker is present.
 *
 * @typedef {'None' | 'Access Not Revoked' | 'Equipment Outstanding' | 'NDA Pending'} BlockerCategory
 */

/**
 * Employee row displayed in the HR / management offboarding dashboard.
 *
 * Mirrors the row produced by the SvelteKit dashboard. Every field is a
 * primitive so the row can be sorted / filtered without further lookup.
 *
 * `daysSinceLeaving` is positive when the employee has already left, zero
 * on their last working day, and negative when their leaving date is in the
 * future (upcoming leaver).
 *
 * @typedef {Object} EmployeeRow
 * @property {string} id                            - UUID of the offboarding record
 * @property {string} employeeId                    - Internal staff number / payroll ID
 * @property {string} employeeName                  - "Surname, Given" display name
 * @property {Department} department                - Department grouping
 * @property {string} role                          - Job title / role
 * @property {CompletionStatus} completionStatus    - Coarse completion category
 * @property {BlockerCategory} blockerCategory      - Most-significant outstanding mandatory item, or 'None'
 * @property {string} leavingDate                   - ISO-8601 leaving date (YYYY-MM-DD)
 * @property {number} daysSinceLeaving              - Integer days since leavingDate (negative => upcoming)
 * @property {boolean} hasBlockers                  - True when blockerCategory !== 'None'
 */

/**
 * Response from `GET /api/dashboard/employees`.
 *
 * @typedef {Object} DashboardEmployeesResponse
 * @property {EmployeeRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.EmployeeOffboardingChecklistDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this
// file is unambiguously side-effecting and other files can rely on it
// loading before they read `window.EmployeeOffboardingChecklistDashboard`.
