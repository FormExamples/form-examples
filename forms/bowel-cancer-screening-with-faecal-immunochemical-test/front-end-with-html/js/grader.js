import { INADEQUATE_SAMPLE, classificationRules } from './rules.js';
import { DEFAULT_THRESHOLD } from './types.js';

// Bowel-cancer-screening FIT grader. Pure functions: take an `AssessmentData`
// object and apply the priority-ordered classification, returning the result
// class, the recommended management action, the symptomatic-pathway indicator,
// a completeness status, and the audit trail of fired rules.
//
// Classification algorithm (spec §4), first match wins:
//   if kitReturned == 'no':
//       resultClass = '';        managementAction = 'repeat-kit'   (non-return)
//   elif sampleAdequacy in (spoilt, insufficient, expired):
//       resultClass = 'spoilt';  managementAction = 'repeat-kit'
//   elif faecalHb != null && faecalHb >= thresholdApplied:
//       resultClass = 'positive'; managementAction = 'refer-colonoscopy'
//   elif faecalHb != null && faecalHb < thresholdApplied:
//       resultClass = 'negative'; managementAction = 'routine-recall'
//   else:  // returned & adequate but no numeric result
//       resultClass = '';        managementAction = 'repeat-kit'   (incomplete)
//
//   symptomaticPathway = redFlagSymptoms == 'yes'   (independent of the result)
//
// The applied threshold defaults to 120 ug Hb/g (screening); configuring it to
// 10 yields the NICE DG56 symptomatic behaviour with the same engine. A missing
// faecal haemoglobin on a returned, adequate kit is treated as incomplete (not
// negative) and drives the incomplete-result flag raised by `flags.js`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ResultClass} ResultClass
 * @typedef {import('./types.js').ManagementAction} ManagementAction
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/** True when a numeric value is present (not null/undefined/NaN). */
function hasNumber(n) {
  return n !== null && n !== undefined && !Number.isNaN(n);
}

/**
 * Compute the FIT classification for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ resultClass: ResultClass, managementAction: ManagementAction,
 *             symptomaticPathway: boolean, status: 'complete'|'incomplete'|'',
 *             firedRules: FiredRule[] }}
 */
function gradeFit(data) {
  const kitReturned = data.kit.kitReturned;
  const sampleAdequacy = data.kit.sampleAdequacy;
  const faecalHb = data.result.faecalHaemoglobinUgG;
  const threshold = hasNumber(data.result.thresholdApplied)
    ? data.result.thresholdApplied
    : DEFAULT_THRESHOLD;
  const redFlagSymptoms = data.symptoms.redFlagSymptoms;

  /** @type {FiredRule[]} */
  const firedRules = [];

  /** @type {ResultClass} */
  let resultClass = '';
  /** @type {ManagementAction} */
  let managementAction = '';
  /** @type {'complete'|'incomplete'|''} */
  let status = '';

  const push = (key) => {
    const r = classificationRules[key];
    if (r) {
      firedRules.push({
        id: r.id,
        instrument: r.instrument,
        band: r.band,
        category: r.category,
        description: r.description
      });
    }
  };

  // ─── Priority-ordered classification (first match wins) ─────────
  if (kitReturned === 'no') {
    resultClass = '';
    managementAction = 'repeat-kit';
    status = 'complete';
    push('non-return');
  } else if (INADEQUATE_SAMPLE.indexOf(sampleAdequacy) !== -1) {
    resultClass = 'spoilt';
    managementAction = 'repeat-kit';
    status = 'complete';
    push('spoilt');
  } else if (hasNumber(faecalHb) && faecalHb >= threshold) {
    resultClass = 'positive';
    managementAction = 'refer-colonoscopy';
    status = 'complete';
    push('positive');
  } else if (hasNumber(faecalHb) && faecalHb < threshold) {
    resultClass = 'negative';
    managementAction = 'routine-recall';
    status = 'complete';
    push('negative');
  } else {
    // Returned (or return unknown) and not inadequate, but no numeric result.
    resultClass = '';
    managementAction = 'repeat-kit';
    status = 'incomplete';
    push('incomplete');
  }

  // ─── Symptomatic pathway (independent of the numeric result) ────
  const symptomaticPathway = redFlagSymptoms === 'yes';
  if (symptomaticPathway) push('symptomatic');

  return {
    resultClass,
    managementAction,
    symptomaticPathway,
    status,
    firedRules
  };
}

export { hasNumber, gradeFit };
