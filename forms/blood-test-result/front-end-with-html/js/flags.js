// Safety-critical flag detection for the Blood Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_blood_test_result_grade_flag.sql`. Flags are returned
// sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').BloodTestResult} BloodTestResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.BloodTestResult.
(function () {
'use strict';
window.BloodTestResult = window.BloodTestResult || {};
const {
  hasCriticalValue,
  hasAbnormalResult,
  hasAnyResultValue
} = window.BloodTestResult;

/**
 * Detect the safety-critical flags for a report.
 * @param {BloodTestResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // ─── critical-result-alert (auto-raised with a critical value) ───
  if (hasCriticalValue(r)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description: 'A critical (panic) value is present.',
      suggestedAction:
        'Communicate the critical result to the requester immediately and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description: 'Critical value present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the requester now and record who was informed, with date and time.'
      });
    }

    // critical value flagged but no supporting detail recorded
    if (r.criticalValueDetail.trim() === '') {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-003',
        category: 'critical-result-alert',
        priority: 'medium',
        description: 'A critical value is present but no critical-value detail was recorded.',
        suggestedAction: 'Record which analyte(s) breached the critical (panic) threshold.'
      });
    }
  }

  // ─── abnormal-requiring-action ───
  if (hasAbnormalResult(r) && !hasCriticalValue(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'An abnormal result requiring timely action is present.',
      suggestedAction: 'Ensure the requester is alerted and a clear action plan is documented.'
    });
  }

  // ─── urgent-referral ───
  if (r.egfr !== null && r.egfr < 30) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'eGFR below 30 mL/min/1.73m² indicates advanced renal impairment.',
      suggestedAction: 'Consider urgent referral to the renal team.'
    });
  }

  // ─── inadequate-specimen ───
  if (
    r.specimenCondition === 'insufficient' ||
    r.specimenCondition === 'haemolysed' ||
    r.specimenCondition === 'clotted'
  ) {
    flags.push({
      flagId: 'F-INADEQUATE-SPECIMEN-001',
      category: 'inadequate-specimen',
      priority: r.specimenCondition === 'insufficient' ? 'high' : 'medium',
      description: 'Specimen condition is ' + r.specimenCondition + '; result reliability may be reduced.',
      suggestedAction: 'Consider repeating the test on a fresh, satisfactory specimen.'
    });
  }

  // ─── missing-impression ───
  if (r.impression.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-IMPRESSION-001',
      category: 'missing-impression',
      priority: 'medium',
      description: 'No impression / conclusion has been recorded.',
      suggestedAction: 'Add an impression that answers the clinical question.'
    });
  }

  // ─── missing-result-value ───
  if (!hasAnyResultValue(r)) {
    flags.push({
      flagId: 'F-MISSING-RESULT-VALUE-001',
      category: 'missing-result-value',
      priority: 'low',
      description: 'No analyte result values were recorded on the report.',
      suggestedAction: 'Record the measured analyte values so the result can be interpreted.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (hasAbnormalResult(r) && r.originatingRequestReference.trim() === '') {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'low',
      description: 'An abnormal result is present but no originating request reference is recorded.',
      suggestedAction: 'Link the report to the originating request to support discrepancy review.'
    });
  }

  // Sort: high > medium > low
  /** @type {Record<FlagPriority, number>} */
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(window.BloodTestResult, {
  detectFlags
});
})();
