// Safety-critical flag detection for the Electrocardiogram Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_electrocardiogram_test_result_grade_flag.sql`. Flags
// are returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').ElectrocardiogramResult} ElectrocardiogramResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.ElectrocardiogramTestResult.
(function () {
'use strict';
window.ElectrocardiogramTestResult = window.ElectrocardiogramTestResult || {};
const { hasCriticalFinding, hasAbnormalRhythm, QTC_PROLONGED_MS } =
  window.ElectrocardiogramTestResult;

/**
 * Detect the safety-critical flags for a report.
 * @param {ElectrocardiogramResult} r
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
        'A critical finding (ST elevation / STEMI, ventricular tachycardia, complete heart block, or markedly prolonged QTc) is present.',
      suggestedAction:
        'Communicate the critical result to the responsible team same-hour and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description: 'Critical finding present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the responsible team now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action (ischaemic pattern, not already critical) ───
  if (r.ischaemia && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'An ischaemic pattern requiring timely action is present.',
      suggestedAction: 'Ensure the responsible team is alerted and a clear action plan is documented.'
    });
  }

  // ─── urgent-referral ───
  if (hasAbnormalRhythm(r) && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'An abnormal rhythm is present and may warrant urgent cardiology referral.',
      suggestedAction: 'Consider urgent referral to the cardiology team.'
    });
  }

  // ─── inadequate-technique ───
  if (r.recordingQuality === 'poor') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: 'medium',
      description: 'Recording quality is poor; diagnostic confidence may be reduced.',
      suggestedAction: 'Consider repeating the ECG to reach diagnostic quality.'
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

  // ─── missing-measurement (intervals not recorded) ───
  if (
    r.ventricularRateBpm === null ||
    r.prIntervalMs === null ||
    r.qrsDurationMs === null ||
    r.qtIntervalMs === null ||
    r.qtcMs === null
  ) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'One or more key measurements (rate, PR, QRS, QT, or QTc) were not recorded.',
      suggestedAction: 'Record the ventricular rate and the PR / QRS / QT / QTc intervals for completeness.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (
    (r.stElevation || r.pathologicalQWaves || r.ischaemia) &&
    r.originatingRequestReference.trim() === ''
  ) {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'low',
      description: 'A significant finding is present but no originating request reference is recorded.',
      suggestedAction: 'Link the report to the originating request to support discrepancy review.'
    });
  }

  // ─── other (QTc prolonged but below the critical threshold) ───
  if (r.qtcMs !== null && r.qtcMs >= 480 && r.qtcMs < QTC_PROLONGED_MS) {
    flags.push({
      flagId: 'F-OTHER-001',
      category: 'other',
      priority: 'low',
      description: 'QTc is borderline prolonged (' + r.qtcMs + ' ms) but below the critical threshold.',
      suggestedAction: 'Review medications and electrolytes; consider repeat ECG for QTc surveillance.'
    });
  }

  // Sort: high > medium > low
  /** @type {Record<FlagPriority, number>} */
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(window.ElectrocardiogramTestResult, {
  detectFlags
});
})();
