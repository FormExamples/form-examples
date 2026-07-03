// Safety-critical flag detection for the Histopathology Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_histopathology_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').HistopathologyResult} HistopathologyResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.HistopathologyTestResult.
// Depends on rules.js (the structured-findings predicates), so it must load
// after it.
(function () {
'use strict';
window.HistopathologyTestResult = window.HistopathologyTestResult || {};
const {
  hasCriticalFinding,
  hasUnexpectedMalignancy,
  hasInvolvedMargin
} = window.HistopathologyTestResult;

/**
 * Detect the safety-critical flags for a report.
 * @param {HistopathologyResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // ─── critical-result-alert (auto-raised with a critical finding) ───
  if (hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description:
        'A critical finding (an unexpected malignancy or an involved resection margin) is present.',
      suggestedAction:
        'Communicate the critical result to the requester immediately and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description:
          'Critical finding present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the requester now and record who was informed, with date and time.'
      });
    }
  }

  // ─── unexpected-finding (malignancy with no originating request linked) ───
  if (hasUnexpectedMalignancy(r)) {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'high',
      description: 'Malignancy is present but no originating request reference is recorded.',
      suggestedAction:
        'Treat as an unexpected significant finding; alert the requester and link the report to the originating request.'
    });
  }

  // ─── abnormal-requiring-action (confirmed malignancy) ───
  if (r.malignancyPresent) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'Confirmed malignancy requiring timely action is present.',
      suggestedAction: 'Ensure the requester is alerted and a clear MDT action plan is documented.'
    });

    // ─── urgent-referral (2-week-wait cancer MDT) ───
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'Malignancy present; urgent cancer MDT referral is warranted.',
      suggestedAction:
        'Refer to the cancer MDT and manage per the 2-week-wait suspected-cancer pathway.'
    });
  }

  // ─── abnormal-requiring-action (involved margin without confirmed malignancy flag handled above) ───
  if (hasInvolvedMargin(r) && !r.malignancyPresent) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-002',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'An involved resection margin is reported.',
      suggestedAction: 'Alert the requester; further excision or MDT review may be required.'
    });
  }

  // ─── urgent-referral (lymphovascular invasion) ───
  if (r.lymphovascularInvasion) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-002',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'Lymphovascular invasion is identified and may warrant urgent referral.',
      suggestedAction: 'Consider urgent referral and MDT discussion of adjuvant management.'
    });
  }

  // ─── inadequate-technique (specimen adequacy) ───
  if (r.specimenAdequacy === 'inadequate' || r.specimenAdequacy === 'suboptimal') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.specimenAdequacy === 'inadequate' ? 'high' : 'medium',
      description:
        'Specimen adequacy is ' + r.specimenAdequacy + '; diagnostic confidence may be reduced.',
      suggestedAction: 'Consider requesting a repeat or further specimen to reach diagnostic quality.'
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

  // ─── missing-measurement (malignancy with no staging recorded) ───
  if (r.malignancyPresent && r.tnmPt.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'Malignancy is present but no pathological pT stage was recorded.',
      suggestedAction: 'Record the pathological TNM stage (pT / pN / pM) for the cancer dataset.'
    });
  }

  // ─── discrepancy-with-request (malignancy with no SNOMED coding) ───
  if (r.malignancyPresent && r.snomedCode.trim() === '') {
    flags.push({
      flagId: 'F-DISCREPANCY-001',
      category: 'discrepancy-with-request',
      priority: 'low',
      description: 'Malignancy is present but no SNOMED CT code was recorded.',
      suggestedAction: 'Add the SNOMED CT topography / morphology code mandated by the dataset.'
    });
  }

  // Sort: high > medium > low
  /** @type {Record<FlagPriority, number>} */
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(window.HistopathologyTestResult, {
  detectFlags
});
})();
