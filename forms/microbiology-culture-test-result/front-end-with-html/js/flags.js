import { hasCriticalOrganism, hasResistanceMarker, isPositiveCulture } from './rules.js';

// Safety-critical flag detection for the Microbiology Culture Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_microbiology_culture_test_result_grade_flag.sql`. Flags
// are returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').MicrobiologyCultureResult} MicrobiologyCultureResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.MicrobiologyCultureTestResult.

/**
 * Detect the safety-critical flags for a report.
 * @param {MicrobiologyCultureResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // ─── critical-result-alert (auto-raised with a critical organism) ───
  if (hasCriticalOrganism(r)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description:
        'A critical organism / result (positive blood culture, CSF isolate, CPE, or flagged critical organism) is present.',
      suggestedAction:
        'Telephone the critical result to the requesting / infection team immediately and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description:
          'Critical organism / result present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the requester now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action (positive specialised test) ───
  if (
    (r.cDifficileToxin === 'positive' || r.acidFastBacilli === 'positive') &&
    !hasCriticalOrganism(r)
  ) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description:
        'A positive specialised test (C. difficile toxin or acid-fast bacilli) requiring timely action is present.',
      suggestedAction:
        'Ensure the requester is alerted, isolate per IPC policy, and document a clear action plan.'
    });
  }

  // ─── urgent-referral (resistance marker on a positive culture) ───
  if (hasResistanceMarker(r) && isPositiveCulture(r)) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'A resistance marker (MRSA / ESBL / CPE) on a significant culture may warrant urgent infection referral.',
      suggestedAction: 'Consider urgent referral to the infection / IPC team for advice.'
    });
  }

  // ─── inadequate-technique (specimen condition) ───
  if (r.specimenCondition === 'insufficient' || r.specimenCondition === 'contaminated') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.specimenCondition === 'insufficient' ? 'high' : 'medium',
      description: 'Specimen condition is ' + r.specimenCondition + '; diagnostic confidence may be reduced.',
      suggestedAction: 'Consider requesting a repeat / fresh specimen to reach diagnostic quality.'
    });
  }

  // ─── incidental-finding (resistance marker without significant culture) ───
  if (hasResistanceMarker(r) && !isPositiveCulture(r)) {
    flags.push({
      flagId: 'F-INCIDENTAL-FINDING-001',
      category: 'incidental-finding',
      priority: 'low',
      description: 'A resistance marker is documented without a significant culture.',
      suggestedAction: 'Manage the resistance marker per the relevant IPC pathway.'
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

  // ─── missing-measurement (positive culture but no sensitivities) ───
  if (isPositiveCulture(r) && r.antibioticSensitivities.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'An organism was isolated but no antibiotic sensitivities were recorded.',
      suggestedAction: 'Record the antibiotic susceptibility results to guide therapy.'
    });
  }

  // ─── unexpected-finding (significant result, no originating request linked) ───
  if (
    (isPositiveCulture(r) || hasCriticalOrganism(r)) &&
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
