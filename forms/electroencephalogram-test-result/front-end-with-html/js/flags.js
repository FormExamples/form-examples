import { hasCriticalFinding } from './rules.js';

// Safety-critical flag detection for the Electroencephalogram (EEG) Test
// Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_electroencephalogram_test_result_grade_flag.sql`.
// Flags are returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').ElectroencephalogramResult} ElectroencephalogramResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

/**
 * Detect the safety-critical flags for a report.
 * @param {ElectroencephalogramResult} r
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
        'A critical finding (status epilepticus, a recorded seizure, or epileptiform discharges) is present.',
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

  // ─── abnormal-requiring-action (status epilepticus is the most acute) ───
  if (r.statusEpilepticus) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'Status epilepticus (including non-convulsive status) requires immediate action.',
      suggestedAction:
        'Ensure the treating team is alerted and an urgent management plan is documented.'
    });
  }

  // ─── urgent-referral ───
  if (r.seizureRecorded || r.photoparoxysmalResponse) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'A recorded seizure or photoparoxysmal response is present and may warrant urgent neurology referral.',
      suggestedAction: 'Consider urgent referral to the neurology / epilepsy team.'
    });
  }

  // ─── inadequate-technique ───
  if (r.recordingQuality === 'limited') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: 'medium',
      description: 'Recording quality is limited; diagnostic confidence may be reduced.',
      suggestedAction: 'Consider repeating or extending the recording to reach diagnostic quality.'
    });
  }

  // ─── incidental-finding (a minor background abnormality on an otherwise normal study) ───
  if (
    (r.backgroundRhythm === 'excess-slow' || r.backgroundRhythm === 'asymmetric') &&
    !hasCriticalFinding(r) &&
    !r.focalSlowing &&
    !r.generalisedSlowing
  ) {
    flags.push({
      flagId: 'F-INCIDENTAL-FINDING-001',
      category: 'incidental-finding',
      priority: 'low',
      description: 'A minor background abnormality is documented as an incidental finding.',
      suggestedAction: 'Correlate the minor background abnormality with the clinical context.'
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

  // ─── missing-measurement (an abnormal study with no recording duration) ───
  if (hasCriticalFinding(r) && r.recordingDurationMinutes === null) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'A significant finding is present but no recording duration was recorded.',
      suggestedAction: 'Record the total recording duration in minutes for audit.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  // Aligned with hasCriticalFinding: status epilepticus is just as much an
  // unexpected significant finding as a recorded seizure or epileptiform
  // discharges, and must not go unflagged just because no request reference
  // is on file.
  if (
    (r.statusEpilepticus || r.seizureRecorded || r.epileptiformDischarges) &&
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
