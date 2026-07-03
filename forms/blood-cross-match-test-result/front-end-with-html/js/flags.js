// Safety-critical flag detection for the blood cross-match test result.
//
// Faithful vanilla-JS port of the SvelteKit engine's
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_blood_cross_match_test_result_grade_flag.sql`.
// Flags are returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').BloodCrossMatchResult} BloodCrossMatchResult
 * @typedef {import('./types.js').Flag} Flag
 */

// Wrapped in an IIFE; published via window.BloodCrossMatchTestResult.
(function () {
'use strict';
const NS = window.BloodCrossMatchTestResult =
  window.BloodCrossMatchTestResult || {};

/**
 * Detect all safety-critical flags for a result.
 *
 * @param {BloodCrossMatchResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // ─── critical-result-alert (auto-raised with a critical result) ───
  if (NS.hasCriticalResult(r)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description:
        'A critical result (incompatible crossmatch, clinically-significant antibodies, ABO discrepancy, or unmet two-sample rule) is present.',
      suggestedAction:
        'Communicate the critical result to the requester immediately, withhold issue until resolved, and document the communication.'
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

  // ─── discrepancy-with-request (identity-safety event) ───
  if (NS.isAboDiscrepancy(r) || NS.isTwoSampleRuleUnmet(r)) {
    flags.push({
      flagId: 'F-DISCREPANCY-001',
      category: 'discrepancy-with-request',
      priority: 'high',
      description:
        'An ABO discrepancy (historical-group non-concordance) or an unmet two-sample group-check rule indicates a possible Wrong-Blood-in-Tube / identity event.',
      suggestedAction:
        'Do not issue. Investigate the discrepancy, request a fresh group-check sample, and escalate to the consultant haematologist.'
    });
  }

  // ─── abnormal-requiring-action (incompatible crossmatch) ───
  if (
    r.crossmatchResult === 'incompatible' &&
    !NS.isAboDiscrepancy(r) &&
    !NS.isTwoSampleRuleUnmet(r)
  ) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'The crossmatch is incompatible; compatible units have not been confirmed.',
      suggestedAction:
        'Investigate the incompatibility and arrange antigen-negative / serologically compatible units.'
    });
  }

  // ─── urgent-referral (clinically-significant antibodies) ───
  if (r.antibodyScreenResult === 'positive') {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'Antibody screen positive; clinically-significant antibodies may require reference-laboratory work-up.',
      suggestedAction:
        'Identify the antibody specificity and select antigen-negative units; refer to the reference laboratory if needed.'
    });
  }

  // ─── inadequate-technique (crossmatch not performed where needed) ───
  if (
    r.crossmatchResult === 'not-performed' &&
    (r.requestType === 'crossmatch' || r.requestType === 'emergency-issue')
  ) {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: 'medium',
      description:
        'A crossmatch / compatibility test was not performed for a crossmatch or emergency-issue request.',
      suggestedAction:
        'Complete the appropriate compatibility testing or document the emergency-issue justification.'
    });
  }

  // ─── missing-impression ───
  if (r.impression.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-IMPRESSION-001',
      category: 'missing-impression',
      priority: 'medium',
      description: 'No impression / conclusion has been recorded.',
      suggestedAction: 'Add an impression that answers the compatibility question.'
    });
  }

  // ─── missing-measurement (insufficient / unrecorded units) ───
  if (NS.insufficientUnits(r)) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'Fewer compatible units are available than were crossmatched.',
      suggestedAction: 'Order additional compatible units to meet the requested quantity.'
    });
  } else if (
    (r.crossmatchResult === 'compatible' || r.crossmatchResult === 'electronic-issue') &&
    r.unitsAvailable === null
  ) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-002',
      category: 'missing-measurement',
      priority: 'low',
      description:
        'A compatible result is recorded but the number of available units was not entered.',
      suggestedAction: 'Record the number of compatible units available for issue.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (
    (r.crossmatchResult === 'incompatible' || r.antibodyScreenResult === 'positive') &&
    r.originatingRequestReference.trim() === ''
  ) {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'low',
      description:
        'A significant finding is present but no originating request reference is recorded.',
      suggestedAction: 'Link the report to the originating request to support discrepancy review.'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(NS, {
  detectFlags
});
})();
