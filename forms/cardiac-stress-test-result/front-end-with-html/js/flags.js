import { hasAnyAbnormalFinding, hasCriticalResult, hasExertionalHypotension, hasHighRiskDukeScore } from './rules.js';

// Safety-critical flag detection for the Cardiac Stress Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_cardiac_stress_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').CardiacStressResult} CardiacStressResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Depends on rules.js (the structured-findings predicates), so it must load
// after it.

/**
 * Detect the safety-critical flags for a report.
 * @param {CardiacStressResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // ─── critical-result-alert (auto-raised with a critical result) ───
  if (hasCriticalResult(r)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description:
        'A critical result (strongly positive test, exertional hypotension, ischaemia at low workload, or a high-risk Duke treadmill score) is present.',
      suggestedAction:
        'Communicate the critical result to the referrer immediately, make an urgent cardiology referral, and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description:
          'Critical result present but it has not been recorded as communicated.',
        suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action (induced ischaemia/chest pain, not yet critical) ───
  if ((r.ischaemicStChanges || r.chestPainInduced) && !hasCriticalResult(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description:
        'Induced ischaemia or chest pain requiring timely action is present.',
      suggestedAction: 'Ensure the referrer is alerted and a clear action plan is documented.'
    });
  }

  // ─── urgent-referral (significant induced arrhythmia or exertional hypotension) ───
  if (r.arrhythmiaInduced || hasExertionalHypotension(r)) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'An induced arrhythmia or exertional hypotension is present and may warrant urgent referral.',
      suggestedAction: 'Consider urgent referral to the appropriate cardiology team.'
    });
  }

  // ─── inadequate-technique (submaximal / early-terminated test) ───
  if (
    r.terminatedEarly ||
    (r.percentPredictedHeartRate !== null && r.percentPredictedHeartRate < 85)
  ) {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: 'medium',
      description:
        'Test was terminated early or submaximal (target heart rate not reached); diagnostic confidence may be reduced.',
      suggestedAction:
        'Consider repeating the test to a maximal endpoint or supplementing with imaging.'
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

  // ─── missing-measurement (positive ECG test with no Duke score) ───
  if (r.testType === 'exercise-treadmill-ecg' && hasAnyAbnormalFinding(r) && r.dukeTreadmillScore === null) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description:
        'An exercise treadmill ECG with an abnormal finding has no Duke treadmill score recorded.',
      suggestedAction: 'Record the Duke treadmill score for prognostic risk stratification.'
    });
  }

  // ─── unexpected-finding (high-risk Duke but conclusion not marked positive) ───
  if (hasHighRiskDukeScore(r) && !r.testPositive) {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'low',
      description:
        'A high-risk Duke treadmill score is recorded but the test conclusion is not marked positive.',
      suggestedAction: 'Reconcile the Duke score risk band with the recorded conclusion.'
    });
  }

  // Sort: high > medium > low
  /** @type {Record<FlagPriority, number>} */
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlags };
