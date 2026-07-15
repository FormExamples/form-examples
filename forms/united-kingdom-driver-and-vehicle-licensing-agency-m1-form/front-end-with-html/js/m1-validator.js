import { detectAdditionalFlags } from './flagged-issues.js';
import { m1Rules } from './m1-rules.js';
import { priorityOrder } from './types.js';

// DVLA M1 form validator. Pure function: takes an `AssessmentData`, returns
// a `ValidationResult` with the fired rules, additional flags, completeness
// flag, stoppedAtQ1 flag, condition count, and a timestamp.
//
// Conditional logic:
//   - Q1 = No  -> form stops at Q1; downstream Q2/Q3 rules are skipped and
//                 the result is marked `stoppedAtQ1: true`.
//   - Q1 = Yes -> all rules apply.
//
// Ported 1:1 from front-end-form-with-svelte/src/lib/engine/m1-validator.ts.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').ValidationResult} ValidationResult
 */

/**
 * @param {AssessmentData} data
 * @returns {ValidationResult}
 */
function validateM1(data) {
  const stoppedAtQ1 =
    data.diagnosisConfirmation.hasMentalHealthDiagnosis === 'no';

  /** @type {FiredRule[]} */
  const firedRules = [];
  for (const rule of m1Rules) {
    // When the patient answered Q1 = No, skip Q2/Q3 rules entirely -
    // the DVLA instructions say not to complete those parts.
    if (
      stoppedAtQ1 &&
      (rule.id.startsWith('M1-Q2') || rule.id.startsWith('M1-Q3'))
    ) {
      continue;
    }
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          priority: rule.priority,
          description: rule.description,
          message: rule.message
        });
      }
    } catch (e) {
      console.warn(`M1 rule ${rule.id} evaluation failed:`, e);
    }
  }

  firedRules.sort(
    (a, b) => priorityOrder(a.priority) - priorityOrder(b.priority)
  );

  const additionalFlags = detectAdditionalFlags(data);
  const conditionCount = countConditions(data);

  const complete =
    firedRules.filter((r) => r.category === 'completeness').length === 0;

  return {
    complete,
    stoppedAtQ1,
    firedRules,
    additionalFlags,
    conditionCount,
    timestamp: new Date().toISOString()
  };
}

/** @param {AssessmentData} data */
function countConditions(data) {
  const c = data.mentalHealthConditions;
  let n = 0;
  if (c.anxietyDepressionWithoutImpairment === 'yes') n++;
  if (c.anxietyDepressionWithImpairment === 'yes') n++;
  if (c.bipolarAffectiveDisorder === 'yes') n++;
  if (c.eatingDisorder === 'yes') n++;
  if (c.ocdOrPtsd === 'yes') n++;
  if (c.personalityDisorder === 'yes') n++;
  if (c.schizophreniaOrPsychosis === 'yes') n++;
  if (c.other === 'yes') n++;
  return n;
}

export { validateM1, countConditions };
