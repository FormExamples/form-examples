// Safety-critical flag detection for the Bronchoscopy Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_bronchoscopy_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').BronchoscopyResult} BronchoscopyResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.BronchoscopyTestResult.
(function () {
'use strict';
window.BronchoscopyTestResult = window.BronchoscopyTestResult || {};
const { hasCriticalFinding } = window.BronchoscopyTestResult;

/**
 * Detect the safety-critical flags for a report.
 * @param {BronchoscopyResult} r
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
        'A critical finding (suspected endobronchial tumour, massive haemoptysis, or pneumothorax) is present.',
      suggestedAction:
        'Communicate the critical result to the referrer immediately and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description: 'Critical finding present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
      });
    }
  }

  // ─── urgent-referral (suspected tumour → lung-cancer MDT) ───
  if (r.endobronchialLesion) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'high',
      description: 'A suspected endobronchial tumour requires urgent lung-cancer MDT referral.',
      suggestedAction: 'Refer urgently to the lung-cancer MDT per the National Optimal Lung Cancer Pathway.'
    });
  }

  // ─── abnormal-requiring-action (extrinsic central-airway compression) ───
  if (r.extrinsicCompression && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'Extrinsic central-airway compression requiring timely action is present.',
      suggestedAction: 'Ensure the referrer is alerted and a clear airway-management plan is documented.'
    });
  }

  // ─── urgent-referral (foreign body / purulent secretions) ───
  if (r.foreignBody || r.secretionsPurulent) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-002',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'A foreign body or purulent secretions are present and may warrant prompt action.',
      suggestedAction: 'Consider foreign-body retrieval or microbiology and treatment as indicated.'
    });
  }

  // ─── inadequate-technique (procedural complication) ───
  if (r.complication === 'hypoxia' || r.complication === 'other') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.complication === 'hypoxia' ? 'high' : 'medium',
      description: 'Procedure complicated by ' + r.complication + '; diagnostic completeness may be reduced.',
      suggestedAction: 'Consider repeating or supplementing the examination to reach a confident conclusion.'
    });
  }

  // ─── incidental-finding (purulent secretions documented) ───
  if (r.secretionsPurulent) {
    flags.push({
      flagId: 'F-INCIDENTAL-FINDING-001',
      category: 'incidental-finding',
      priority: 'low',
      description: 'Purulent secretions are documented.',
      suggestedAction: 'Send samples for microbiology and manage any infection per the relevant pathway.'
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

  // ─── missing-measurement (lesion present but no location recorded) ───
  if (r.endobronchialLesion && r.lesionLocation.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'An endobronchial lesion is reported but no anatomical location was recorded.',
      suggestedAction: 'Record the anatomical location of the lesion to support staging and follow-up.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if ((r.endobronchialLesion || r.foreignBody) && r.originatingRequestReference.trim() === '') {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'low',
      description: 'A significant finding is present but no originating request reference is recorded.',
      suggestedAction: 'Link the report to the originating request to support discrepancy review.'
    });
  }

  // Sort: high > medium > low
  /** @type {Record<FlagPriority, number>} */
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(window.BronchoscopyTestResult, {
  detectFlags
});
})();
