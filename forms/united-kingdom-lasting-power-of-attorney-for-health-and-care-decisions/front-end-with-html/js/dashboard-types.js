// JSDoc type definitions mirroring the SvelteKit dashboard's `data/sample.ts`.
//
// Loaded as a classic script (no ES modules) so the page works when opened
// directly via file://. This file deliberately exports nothing executable;
// it exists so other modules can reference the JSDoc type aliases via
// `@typedef` imports.

/**
 * @typedef {'ready-to-register' | 'needs-correction' | 'invalid'} ValidityStatus
 */

/**
 * @typedef {'draft' | 'awaiting-signatures' | 'submitted-to-opg' | 'registered' | 'rejected' | 'revoked'} RegistrationStage
 */

/**
 * @typedef {'england' | 'wales'} Jurisdiction
 */

/**
 * @typedef {'jointly' | 'jointly-and-severally' | 'mixed'} DecisionRule
 */

/**
 * @typedef {'option-a' | 'option-b' | ''} LstChoice
 */

/**
 * @typedef {Object} FiredRuleRow
 * @property {string} ruleId
 * @property {'fatal' | 'high' | 'medium' | 'informational'} severity
 * @property {string} description
 */

/**
 * @typedef {Object} LpaRow
 * @property {string} id
 * @property {string} donorMaskedName
 * @property {number} donorBirthYear
 * @property {Jurisdiction} jurisdiction
 * @property {number} attorneyCount
 * @property {number} replacementAttorneyCount
 * @property {DecisionRule} decisionRule
 * @property {LstChoice} lstChoice
 * @property {ValidityStatus} validityStatus
 * @property {number} completenessScore
 * @property {RegistrationStage} registrationStage
 * @property {string} updatedAt
 * @property {number} fatalRuleCount
 * @property {FiredRuleRow[]} firedRules
 */
