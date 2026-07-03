// Safety-critical flag detection for the Hearing Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_hearing_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').HearingResult} HearingResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.HearingTestResult.
// Depends on rules.js (hasCriticalFinding), so it must load after it.
(function () {
'use strict';
window.HearingTestResult = window.HearingTestResult || {};
const { hasCriticalFinding } = window.HearingTestResult;

/**
 * Detect the safety-critical flags for a report.
 * @param {HearingResult} r
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
        'A critical finding (sudden sensorineural hearing loss or marked asymmetry) is present.',
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

  // ─── sudden-sensorineural-loss (otological emergency) ───
  if (r.suddenSensorineuralLoss) {
    flags.push({
      flagId: 'F-SUDDEN-SNHL-001',
      category: 'sudden-sensorineural-loss',
      priority: 'high',
      description: 'Result is consistent with sudden sensorineural hearing loss (otological emergency).',
      suggestedAction: 'Refer urgently to ENT; consider high-dose corticosteroids per local guidance.'
    });
  }

  // ─── asymmetric-loss-retrocochlear ───
  if (r.asymmetricLoss) {
    flags.push({
      flagId: 'F-ASYMMETRIC-LOSS-001',
      category: 'asymmetric-loss-retrocochlear',
      priority: 'high',
      description: 'Marked asymmetry between ears (red flag for retrocochlear pathology).',
      suggestedAction: 'Refer to ENT for MRI of the internal auditory meatus to exclude vestibular schwannoma.'
    });
  }

  // ─── abnormal-requiring-action ───
  if (r.hearingLossPresent && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'medium',
      description: 'Hearing loss is present and may require timely management.',
      suggestedAction: 'Ensure the referrer is alerted and a clear management plan is documented.'
    });
  }

  // ─── urgent-referral ───
  if (r.conductiveComponent) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'A conductive component is present and may warrant ENT referral.',
      suggestedAction: 'Consider referral to ENT for assessment of the conductive component.'
    });
  }

  // ─── unreliable-test ───
  if (r.testReliability === 'poor' || r.testReliability === 'fair') {
    flags.push({
      flagId: 'F-UNRELIABLE-TEST-001',
      category: 'unreliable-test',
      priority: r.testReliability === 'poor' ? 'high' : 'medium',
      description: `Test reliability is ${r.testReliability}; diagnostic confidence may be reduced.`,
      suggestedAction: 'Consider repeating the test under better conditions to reach a reliable result.'
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

  // ─── missing-measurement ───
  if (
    r.hearingLossPresent &&
    r.pureToneAverageRightDb === null &&
    r.pureToneAverageLeftDb === null
  ) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'Hearing loss is reported but no pure-tone average was recorded.',
      suggestedAction: 'Record the per-ear pure-tone averages (dB HL) for severity grading.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (r.hearingLossPresent && r.originatingRequestReference.trim() === '') {
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

Object.assign(window.HearingTestResult, {
  detectFlags
});
})();
