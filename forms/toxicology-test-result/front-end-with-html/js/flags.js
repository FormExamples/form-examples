import { hasAnyResultValue, hasToxicResult } from './rules.js';

// Safety-critical flag detection for the Toxicology Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_toxicology_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').ToxicologyResult} ToxicologyResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Depends on rules.js (hasToxicResult, hasAnyResultValue), so it must load
// after it.

/**
 * Detect the safety-critical flags for a report.
 * @param {ToxicologyResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // ─── critical-result-alert (auto-raised with a toxic level) ───
  if (hasToxicResult(r) || r.overallResultStatus === 'critical') {
    const paracetamol = r.paracetamolNomogram === 'above-treatment-line';
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description: paracetamol
        ? 'Paracetamol level is above the treatment line.'
        : 'A toxic level requiring action is present.',
      suggestedAction: paracetamol
        ? 'Communicate the critical result to the requester immediately and start N-acetylcysteine (NAC).'
        : 'Communicate the critical result to the requester immediately and start the appropriate antidote / urgent treatment.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description: 'Toxic result present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the requester now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action ───
  if (r.overallResultStatus === 'abnormal' && !hasToxicResult(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'An abnormal result requiring timely action is present.',
      suggestedAction: 'Ensure the requester is alerted and a clear action plan is documented.'
    });
  }

  // ─── urgent-referral ───
  if (
    (r.lithiumLevelMmolL !== null && r.lithiumLevelMmolL >= 1.5) ||
    (r.carboxyhaemoglobinPercent !== null && r.carboxyhaemoglobinPercent >= 10)
  ) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'A lithium or carboxyhaemoglobin level is in a range that may warrant urgent referral.',
      suggestedAction: 'Consider urgent referral to the appropriate specialist / toxicology team.'
    });
  }

  // ─── inadequate-technique (specimen condition) ───
  if (r.specimenCondition === 'insufficient' || r.specimenCondition === 'delayed') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.specimenCondition === 'insufficient' ? 'high' : 'medium',
      description:
        'Specimen condition is ' + r.specimenCondition + '; interpretive confidence may be reduced.',
      suggestedAction: 'Consider repeating the assay on a satisfactory, correctly-timed specimen.'
    });
  }

  // ─── discrepancy-with-request (paracetamol not interpretable before 4 h) ───
  if (
    r.paracetamolLevelMgL !== null &&
    r.paracetamolNomogram !== 'not-applicable' &&
    r.timeSinceIngestionHours !== null &&
    r.timeSinceIngestionHours < 4
  ) {
    flags.push({
      flagId: 'F-DISCREPANCY-001',
      category: 'discrepancy-with-request',
      priority: 'medium',
      description:
        'Paracetamol level reported against the nomogram before 4 hours post-ingestion; the nomogram is not interpretable before 4 hours.',
      suggestedAction: 'Repeat the paracetamol level at or after 4 hours post-ingestion before plotting.'
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
  if (!hasAnyResultValue(r)) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'No assay result value has been recorded.',
      suggestedAction: 'Record at least one assay level or screen result for the report.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (
    (hasToxicResult(r) || r.overallResultStatus === 'abnormal') &&
    r.originatingRequestReference.trim() === ''
  ) {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'low',
      description: 'A significant result is present but no originating request reference is recorded.',
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
