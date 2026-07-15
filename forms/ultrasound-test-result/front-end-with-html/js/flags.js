import { hasCriticalFinding } from './rules.js';

// Safety-critical flag detection for the Ultrasound Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_ultrasound_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').UltrasoundResult} UltrasoundResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.UltrasoundTestResult.

/**
 * Detect the safety-critical flags for a report.
 * @param {UltrasoundResult} r
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
      description: 'A critical finding (DVT present or aneurysm) is present.',
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

  // ─── abnormal-requiring-action (hydronephrosis: risk of obstructed system) ───
  if (r.hydronephrosis && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'Hydronephrosis is present and may indicate an obstructed system requiring timely action.',
      suggestedAction: 'Ensure the referrer is alerted and a clear action plan is documented.'
    });
  }

  // ─── urgent-referral ───
  if (r.massOrLesion || r.gallstones) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'A mass / lesion or gallstones are present and may warrant onward referral.',
      suggestedAction: 'Consider referral to the appropriate specialist team as clinically indicated.'
    });
  }

  // ─── inadequate-technique ───
  if (
    r.examinationAdequacy === 'non-diagnostic' ||
    r.examinationAdequacy === 'limited-body-habitus'
  ) {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.examinationAdequacy === 'non-diagnostic' ? 'high' : 'medium',
      description: 'Examination adequacy is ' + r.examinationAdequacy + '; diagnostic confidence may be reduced.',
      suggestedAction: 'Consider repeating or supplementing the examination to reach diagnostic quality.'
    });
  }

  // ─── incidental-finding ───
  if (r.incidentalFinding) {
    flags.push({
      flagId: 'F-INCIDENTAL-FINDING-001',
      category: 'incidental-finding',
      priority: 'low',
      description: 'One or more incidental findings are documented.',
      suggestedAction: 'Manage the incidental finding per the relevant structured pathway.'
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
  if (r.massOrLesion && r.largestLesionSizeMm === null) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'A mass or lesion is reported but no measurement was recorded.',
      suggestedAction: 'Record the largest lesion long-axis size in millimetres for surveillance.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (
    (r.massOrLesion || r.aneurysm) &&
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
