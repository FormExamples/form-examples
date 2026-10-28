// JSDoc type definitions for the Medical Device Assessment dashboard rows.
//
// This file deliberately exports nothing executable; other modules reference
// the aliases via `@typedef` imports.

/**
 * @typedef {'I' | 'IIa' | 'IIb' | 'III' | ''} DeviceClass
 * @typedef {'self-declaration' | 'notified-body-partial' | 'notified-body-full' | ''} ConformityRoute
 * @typedef {'ready' | 'gaps' | 'blocked'} Readiness
 */

/**
 * Assessment row displayed in the dashboard.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                       - Case identifier
 * @property {string} date                     - ISO date "YYYY-MM-DD"
 * @property {string} device                   - Device display name
 * @property {string} deviceKind               - Engine deviceKind value
 * @property {DeviceClass} computedClass       - Class computed by the engine
 * @property {DeviceClass} finalClass          - Class after any assessor override
 * @property {string} classSuffix              - '' or a combination of s, m, r
 * @property {ConformityRoute} conformityRoute - Conformity-assessment route
 * @property {string} determiningRule          - Rule id that set the class
 * @property {Readiness} readiness             - Regulatory readiness
 * @property {string[]} flags                  - Flag ids raised by the engine
 * @property {string} summary                  - Intended-purpose summary
 */
/**
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} [total]
 */
export {};
