import { culturePositive, hasCriticalFinding } from './rules.js';

// Safety-critical flag detection for the Lumbar Puncture Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_lumbar_puncture_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').LumbarPunctureResult} LumbarPunctureResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.LumbarPunctureTestResult.

/**
 * Detect the safety-critical flags for a report.
 * @param {LumbarPunctureResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // ─── critical-result-alert (auto-raised with a critical CSF result) ───
  if (hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description:
        'A critical CSF result (bacterial meningitis pattern, suggested subarachnoid haemorrhage, or positive culture) is present.',
      suggestedAction:
        'Communicate the critical result to the requesting clinician immediately and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description: 'Critical CSF result present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the requesting clinician now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action (bacterial meningitis pattern specifically) ───
  if (r.bacterialMeningitisPattern) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'A bacterial meningitis CSF pattern is present and requires immediate action.',
      suggestedAction:
        'Ensure empirical antibiotics are given without delay per NICE NG240 and the responsible team is alerted.'
    });
  }

  // ─── urgent-referral (suggested subarachnoid haemorrhage) ───
  if (r.subarachnoidHaemorrhageSuggested || r.xanthochromia === 'positive') {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'Positive xanthochromia / a pattern suggesting subarachnoid haemorrhage is present.',
      suggestedAction: 'Consider urgent neurology / neurosurgery referral and CT angiography per local pathway.'
    });
  }

  // ─── inadequate-technique (heavily blood-stained tap obscuring interpretation) ───
  if (
    r.csfAppearance === 'blood-stained' &&
    r.csfRedCellCount !== null &&
    r.csfRedCellCount > 100000
  ) {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: 'medium',
      description: 'A heavily blood-stained tap with a very high red cell count may obscure CSF interpretation.',
      suggestedAction: 'Consider a traumatic tap and whether repeat sampling or spectrophotometry is required.'
    });
  }

  // ─── unexpected-finding (positive oligoclonal bands without a request reference) ───
  if (r.oligoclonalBands === 'positive') {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'low',
      description: 'CSF-specific oligoclonal bands are positive, supporting an inflammatory / demyelinating process.',
      suggestedAction: 'Correlate with paired serum and consider neurology referral for demyelination work-up.'
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

  // ─── missing-measurement (pattern asserted without supporting numbers) ───
  if (
    (r.bacterialMeningitisPattern || r.viralPattern) &&
    r.csfWhiteCellCount === null
  ) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'A meningitis pattern is asserted but no CSF white cell count was recorded.',
      suggestedAction: 'Record the CSF white cell count (and differential) to support the pattern.'
    });
  }

  // ─── discrepancy-with-request (significant result, no originating request linked) ───
  if (
    culturePositive(r) &&
    r.originatingRequestReference.trim() === ''
  ) {
    flags.push({
      flagId: 'F-DISCREPANCY-001',
      category: 'discrepancy-with-request',
      priority: 'low',
      description: 'A positive culture is present but no originating request reference is recorded.',
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
