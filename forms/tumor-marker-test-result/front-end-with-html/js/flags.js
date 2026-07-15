import { hasActionSignal, hasAnyMeasuredMarker, hasGermCellCriticalMarker, isCriticalResult } from './rules.js';

// Safety-critical flag detection for the Tumor Marker Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Flag IDs, categories, priorities, and
// descriptions are stable and identical across every front-end and the
// back-end; rows mirror the
// `tumor_marker_test_result_grade_flag` SQL table. Flags are detected
// independently of the four axes and returned sorted high → medium → low.

/**
 * @typedef {import('./types.js').TumorMarkerResult} TumorMarkerResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Depends on rules.js predicates, so it must load after rules.js.

/**
 * Detects safety-critical flags independently of the four axes.
 * @param {TumorMarkerResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // ─── critical-result-alert (auto-raised with a critical result) ───
  if (isCriticalResult(r)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description: hasGermCellCriticalMarker(r)
        ? 'A very high AFP / beta-hCG (suggesting a germ-cell tumour) is present.'
        : 'The overall result status is recorded as critical.',
      suggestedAction:
        'Communicate the critical result to the requester immediately and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description: 'Critical result present but it has not been recorded as communicated.',
        suggestedAction: 'Contact the requester now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action ───
  if (hasActionSignal(r) && !isCriticalResult(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description:
        'A markedly elevated value or a rising trend on treatment requires timely action.',
      suggestedAction: 'Ensure the requester is alerted and a clear action plan is documented.'
    });
  }

  // ─── urgent-referral ───
  if (r.trend === 'rising' && !isCriticalResult(r)) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'A rising marker trend on treatment may warrant urgent oncology referral.',
      suggestedAction: 'Consider urgent referral to the appropriate oncology team.'
    });
  }

  // ─── inadequate-technique (specimen condition) ───
  if (
    r.specimenCondition === 'insufficient' ||
    r.specimenCondition === 'haemolysed' ||
    r.specimenCondition === 'lipaemic'
  ) {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.specimenCondition === 'insufficient' ? 'high' : 'medium',
      description: `Specimen condition is ${r.specimenCondition}; assay validity may be reduced.`,
      suggestedAction: 'Consider repeating the assay on a satisfactory specimen.'
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
  if (!hasAnyMeasuredMarker(r)) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'No tumour-marker value has been recorded.',
      suggestedAction: 'Record at least one measured serum tumour-marker value.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (hasActionSignal(r) && r.originatingRequestReference.trim() === '') {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'low',
      description:
        'A significant marker result is present but no originating request reference is recorded.',
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
