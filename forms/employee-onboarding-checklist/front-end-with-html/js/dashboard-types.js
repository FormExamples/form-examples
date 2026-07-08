// Plain-JavaScript / JSDoc type definitions for the HR / management
// dashboard data model.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.
//
// The shape mirrors the `GradingResult` produced by the SvelteKit form's
// scoring engine, projected into the row-level summary used by the
// dashboard table.

/**
 * Onboarding completion status — coarse-grained category derived from the
 * scoring engine's `completionPercentage` plus the overdue flag. The
 * dashboard surfaces these labels in the status column / filter dropdown.
 *
 * @typedef {'Not Started' | 'In Progress' | 'Complete' | 'Overdue'} CompletionStatus
 */

/**
 * Highest milestone the employee has reached on the onboarding timeline.
 *
 * @typedef {'Pre-arrival' | 'Day 1' | 'Week 1' | '30 Day' | '60 Day' | '90 Day'} Milestone
 */

/**
 * Department grouping used in the dashboard filter and table column.
 *
 * @typedef {'Nursing' | 'Medical' | 'Admin' | 'Allied Health' | 'IT'} Department
 */

/**
 * Employee row displayed in the HR / management dashboard.
 *
 * Mirrors the row produced by the SvelteKit dashboard. Every field is a
 * primitive so the row can be sorted / filtered without further lookup.
 *
 * @typedef {Object} EmployeeRow
 * @property {string} id                            - UUID of the onboarding record
 * @property {string} employeeId                    - Internal staff number / payroll ID
 * @property {string} employeeName                  - "Surname, Given" display name
 * @property {Department} department                - Department grouping
 * @property {string} role                          - Job title / role
 * @property {number} completionPercent             - 0-100 completion percentage
 * @property {CompletionStatus} completionStatus    - Coarse completion category
 * @property {Milestone} milestoneReached           - Highest milestone hit so far
 * @property {string} startDate                     - ISO-8601 start date (YYYY-MM-DD)
 * @property {boolean} overdue                      - True when at least one mandatory item is past due
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
// namespace, `window.EmployeeOnboardingChecklistDashboard`.
(function () {
'use strict';
window.EmployeeOnboardingChecklistDashboard =
  window.EmployeeOnboardingChecklistDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this
// file is unambiguously side-effecting and other files can rely on it
// loading before they read `window.EmployeeOnboardingChecklistDashboard`.
})();
