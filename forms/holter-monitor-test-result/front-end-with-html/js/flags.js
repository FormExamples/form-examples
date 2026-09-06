import { hasCriticalFinding, hasSignificantPause } from './rules.js';

// Safety-critical flag detection for the Holter Monitor Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_holter_monitor_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').HolterMonitorResult} HolterMonitorResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Depends on rules.js (the structured-findings predicates), so it must load
// after it.

/**
 * Detect the safety-critical flags for a report.
 * @param {HolterMonitorResult} r
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
        'A critical rhythm finding (ventricular tachycardia, pause > 3 s, high-grade AV block, or fast atrial fibrillation) is present.',
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

  // ─── abnormal-requiring-action (high-grade AV block / VT outside the critical pathway) ───
  if (r.supraventricularTachycardia && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'Supraventricular tachycardia is present and may require timely action.',
      suggestedAction: 'Ensure the referrer is alerted and a clear management plan is documented.'
    });
  }

  // ─── urgent-referral ───
  if ((r.atrialFibrillationDetected || hasSignificantPause(r)) && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'Atrial fibrillation or a significant pause is present and may warrant urgent referral.',
      suggestedAction: 'Consider urgent referral to the appropriate cardiology team.'
    });
  }

  // ─── inadequate-recording ───
  if (r.analysedPercent !== null && r.analysedPercent < 70) {
    flags.push({
      flagId: 'F-INADEQUATE-RECORDING-001',
      category: 'inadequate-recording',
      priority: r.analysedPercent < 50 ? 'high' : 'medium',
      description: 'Only ' + r.analysedPercent + '% of the recording was analysable; diagnostic confidence may be reduced.',
      suggestedAction: 'Consider repeating or extending the ambulatory recording to reach diagnostic quality.'
    });
  }

  // ─── incidental-finding ───
  if (r.symptomRhythmCorrelation) {
    flags.push({
      flagId: 'F-INCIDENTAL-FINDING-001',
      category: 'incidental-finding',
      priority: 'low',
      description: 'A symptom-rhythm correlation is documented.',
      suggestedAction: 'Manage the correlated rhythm per the relevant ambulatory ECG pathway.'
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
  if (r.meanHeartRateBpm === null) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'No mean heart rate was recorded for the rate summary.',
      suggestedAction: 'Record the mean (24-hour average) heart rate for the rate summary.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  // Aligned with hasCriticalFinding: a significant pause is just as much an
  // unexpected significant finding as AF / VT / high-grade AV block, and
  // must not go unflagged just because no request reference is on file.
  // (Fast AF needs no separate mention — it is a strict subset of
  // atrialFibrillationDetected, already covered below.)
  if (
    (r.atrialFibrillationDetected ||
      r.ventricularTachycardia ||
      r.highGradeAvBlock ||
      hasSignificantPause(r)) &&
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

  // Sort: high > medium > low
  /** @type {Record<FlagPriority, number>} */
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlags };
