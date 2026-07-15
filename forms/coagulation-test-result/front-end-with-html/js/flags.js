import { hasAnyResultValue, hasCriticalValue, hasDicPicture, hasIsolatedApttProlongation, hasSpecimenQualityIssue } from './rules.js';

// Safety-critical flag detection for the Coagulation Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_coagulation_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').CoagulationResult} CoagulationResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Depends on rules.js (the critical-value predicates), so it must load after
// it.

/**
 * Detect the safety-critical flags for a report.
 * @param {CoagulationResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // ─── critical-result-alert (auto-raised with a critical value) ───
  if (hasCriticalValue(r)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description:
        'A critical value (INR > 8, fibrinogen < 1.0 g/L, a DIC picture, or a flagged critical result) is present.',
      suggestedAction:
        'Communicate the critical result to the referrer immediately and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description: 'Critical value present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action (DIC picture, not otherwise communicated) ───
  if (hasDicPicture(r) && !hasCriticalValue(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'A DIC picture requiring timely action is present.',
      suggestedAction: 'Ensure the referrer is alerted and a clear action plan is documented.'
    });
  }

  // ─── urgent-referral (isolated APTT prolongation needing work-up) ───
  if (hasIsolatedApttProlongation(r)) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'An isolated APTT prolongation is present and may warrant haematology referral for inhibitor / factor work-up.',
      suggestedAction: 'Consider referral to haematology for mixing studies and factor assays.'
    });
  }

  // ─── specimen-quality-issue ───
  if (hasSpecimenQualityIssue(r)) {
    flags.push({
      flagId: 'F-SPECIMEN-QUALITY-001',
      category: 'specimen-quality-issue',
      priority: r.specimenCondition === 'insufficient' ? 'high' : 'medium',
      description: 'Specimen condition is ' + r.specimenCondition + '; result interpretation may be unreliable.',
      suggestedAction: 'Consider requesting a repeat specimen before acting on the result.'
    });
  }

  // ─── incidental-finding (anticoagulant effect not flagged in impression) ───
  if (r.onAnticoagulant && r.anticoagulantAgent.trim() === '') {
    flags.push({
      flagId: 'F-INCIDENTAL-FINDING-001',
      category: 'incidental-finding',
      priority: 'low',
      description: 'Patient recorded as on anticoagulant therapy but no agent was specified.',
      suggestedAction: 'Record the anticoagulant agent to support interpretation of PT/INR/APTT.'
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

  // ─── missing-result-value ───
  if (!hasAnyResultValue(r)) {
    flags.push({
      flagId: 'F-MISSING-RESULT-VALUE-001',
      category: 'missing-result-value',
      priority: 'medium',
      description: 'No coagulation result value has been recorded.',
      suggestedAction: 'Record at least one reported result value (PT/INR, APTT, fibrinogen, etc.).'
    });
  }

  // ─── discrepancy-with-request (abnormal value but no originating request linked) ───
  if (
    (r.overallResultStatus === 'abnormal' || r.overallResultStatus === 'critical') &&
    r.originatingRequestReference.trim() === ''
  ) {
    flags.push({
      flagId: 'F-DISCREPANCY-001',
      category: 'discrepancy-with-request',
      priority: 'low',
      description:
        'A significant result is present but no originating request reference is recorded.',
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
