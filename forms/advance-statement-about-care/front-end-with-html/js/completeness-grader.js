import { completenessRules } from './completeness-rules.js';
import { detectFlaggedIssues } from './flagged-issues.js';

// Completeness grader. Pure functions: take a `StatementData` object,
// evaluate every completeness rule and return the level
// (incomplete | partial | complete | verified), the list of missing
// sections, the completed/total counts and the timestamp.
//
// Mirrors `src/lib/engine/completeness-grader.ts` in the SvelteKit reference.
//
// Level decision tree:
//   * verified   -> all required rules pass + witnessed + HCP acknowledged
//   * complete   -> all required rules pass
//   * partial    -> at least one rule passes
//   * incomplete -> nothing has been filled

/**
 * @typedef {import('./types.js').StatementData} StatementData
 * @typedef {import('./types.js').CompletenessLevel} CompletenessLevel
 * @typedef {import('./types.js').MissingSection} MissingSection
 * @typedef {import('./types.js').CompletenessResult} CompletenessResult
 */

// Wrapped in an IIFE; published via window.AdvanceStatementAboutCare.

/**
 * @param {StatementData} data
 * @param {number} missingRequiredCount
 * @param {number} completedCount
 * @returns {CompletenessLevel}
 */
function determineLevel(data, missingRequiredCount, completedCount) {
  // Verified: all required complete + witnessed + healthcare professional acknowledged
  const isWitnessed =
    data.signaturesWitnesses.witnessName.trim() !== '' &&
    data.signaturesWitnesses.witnessSignature.trim() !== '';
  const isProfessionalAcknowledged =
    data.signaturesWitnesses.healthcareProfessionalName.trim() !== '' &&
    data.signaturesWitnesses.healthcareProfessionalSignature.trim() !== '';

  if (missingRequiredCount === 0 && isWitnessed && isProfessionalAcknowledged) {
    return 'verified';
  }
  if (missingRequiredCount === 0) {
    return 'complete';
  }
  if (completedCount > 0) {
    return 'partial';
  }
  return 'incomplete';
}

/**
 * Pure: evaluate every completeness rule against the supplied data.
 * @param {StatementData} data
 * @returns {CompletenessResult}
 */
function calculateCompleteness(data) {
  /** @type {MissingSection[]} */
  const missingSections = [];
  let completedCount = 0;
  const totalCount = completenessRules.length;

  for (const rule of completenessRules) {
    try {
      if (rule.evaluate(data)) {
        completedCount++;
      } else {
        missingSections.push({
          id: rule.id,
          section: rule.section,
          description: rule.description,
          required: rule.required
        });
      }
    } catch (e) {
      console.warn(`Completeness rule ${rule.id} evaluation failed:`, e);
      missingSections.push({
        id: rule.id,
        section: rule.section,
        description: rule.description,
        required: rule.required
      });
    }
  }

  const flaggedIssues = detectFlaggedIssues(data);
  const missingRequired = missingSections.filter((s) => s.required);
  const level = determineLevel(data, missingRequired.length, completedCount);

  return {
    level,
    missingSections,
    flaggedIssues,
    completedCount,
    totalCount,
    timestamp: new Date().toISOString()
  };
}

export { calculateCompleteness };
