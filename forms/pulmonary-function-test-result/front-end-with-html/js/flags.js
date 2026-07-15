import { hasCriticalFinding } from './rules.js';

// Safety-critical flag detection for the Pulmonary Function Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Flags are detected independently of the
// four grading axes; flag categories mirror
// `sql/07_create_table_pulmonary_function_test_result_grade_flag.sql`.
// Flags are returned sorted high -> medium -> low priority.

/**
 * @typedef {import('./types.js').PulmonaryFunctionResult} PulmonaryFunctionResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.PulmonaryFunctionTestResult.
// Depends on rules.js (hasCriticalFinding), so it must load after it.

/**
 * Detect the safety-critical flags for a report.
 * @param {PulmonaryFunctionResult} r
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
        'A critical finding (severe or very-severe airflow obstruction or restriction) is present.',
      suggestedAction:
        'Communicate the critical result to the referrer immediately and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description:
          'Critical finding present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action ───
  if (
    (r.airflowObstruction || r.restriction) &&
    r.severity === 'moderate' &&
    !hasCriticalFinding(r)
  ) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'A moderate ventilatory impairment requiring timely action is present.',
      suggestedAction: 'Ensure the referrer is alerted and a clear action plan is documented.'
    });
  }

  // ─── urgent-referral ───
  if (r.reducedGasTransfer) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'Reduced gas transfer (low DLCO) is present and may warrant respiratory referral.',
      suggestedAction: 'Consider referral to the respiratory team for further characterisation.'
    });
  }

  // ─── inadequate-technique ───
  if (r.testQuality === 'unacceptable' || r.testQuality === 'sub-optimal') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.testQuality === 'unacceptable' ? 'high' : 'medium',
      description: `Test quality is ${r.testQuality}; diagnostic confidence may be reduced.`,
      suggestedAction: 'Consider repeating the test to ATS/ERS acceptability and repeatability standards.'
    });
  }

  // ─── discrepancy-with-request ───
  if (r.significantReversibility && r.bronchodilatorReversibility === 'not-tested') {
    flags.push({
      flagId: 'F-DISCREPANCY-001',
      category: 'discrepancy-with-request',
      priority: 'low',
      description:
        'Significant reversibility is flagged but bronchodilator reversibility was recorded as not-tested.',
      suggestedAction: 'Reconcile the reversibility finding with the reversibility test result.'
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
    (r.airflowObstruction || r.restriction) &&
    r.fev1Litres === null &&
    r.fvcLitres === null
  ) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'An abnormal ventilatory pattern is reported but no spirometry value was recorded.',
      suggestedAction: 'Record the FEV1 and FVC values to support interpretation and surveillance.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (
    (r.airflowObstruction || r.restriction || r.reducedGasTransfer) &&
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
