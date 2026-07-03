// Safety-critical flag detection for the Eye Vision Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_eye_vision_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').EyeVisionResult} EyeVisionResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.EyeVisionTestResult.
// Depends on rules.js (the structured-findings predicates), so it must load
// after it.
(function () {
'use strict';
window.EyeVisionTestResult = window.EyeVisionTestResult || {};
const {
  hasCriticalFinding,
  hasReferableRetinopathy,
  hasElevatedIop
} = window.EyeVisionTestResult;

/**
 * Detect the safety-critical flags for a report.
 * @param {EyeVisionResult} r
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
        'A critical ophthalmic finding (proliferative retinopathy, acutely raised IOP, or reduced acuity with optic-disc abnormality) is present.',
      suggestedAction:
        'Arrange urgent ophthalmology review and communicate the critical result to the referrer immediately, documenting the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description:
          'Critical finding present but the result has not been recorded as communicated.',
        suggestedAction:
          'Contact the referrer now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action (referable retinopathy, not already critical) ───
  if (hasReferableRetinopathy(r) && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description:
        'Referable diabetic retinopathy / maculopathy requiring timely action is present.',
      suggestedAction:
        'Refer to the hospital eye service per the diabetic eye screening pathway and document the action plan.'
    });
  }

  // ─── urgent-referral (elevated IOP above the NG81 threshold) ───
  if (hasElevatedIop(r) && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'Intraocular pressure is at or above the NICE NG81 referral threshold (24 mmHg).',
      suggestedAction: 'Consider referral for glaucoma assessment per NICE NG81.'
    });
  }

  // ─── inadequate-technique (no measurements recorded at all) ───
  if (
    r.visualAcuityRight.trim() === '' &&
    r.visualAcuityLeft.trim() === '' &&
    r.intraocularPressureRightMmhg === null &&
    r.intraocularPressureLeftMmhg === null &&
    r.visualFieldResult === ''
  ) {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: 'medium',
      description:
        'No measurements were recorded; diagnostic confidence may be reduced.',
      suggestedAction:
        'Record at least one measurement (visual acuity, intraocular pressure, or visual fields).'
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

  // ─── missing-measurement (raised IOP flagged but no pressure recorded) ───
  if (
    r.raisedIntraocularPressure &&
    r.intraocularPressureRightMmhg === null &&
    r.intraocularPressureLeftMmhg === null
  ) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description:
        'Raised intraocular pressure is reported but no pressure value was recorded.',
      suggestedAction: 'Record the intraocular pressure in mmHg for each eye.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (
    (r.opticDiscAbnormality || r.macularAbnormality) &&
    r.originatingRequestReference.trim() === ''
  ) {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'low',
      description:
        'A significant finding is present but no originating request reference is recorded.',
      suggestedAction:
        'Link the report to the originating request to support discrepancy review.'
    });
  }

  // Sort: high > medium > low
  /** @type {Record<FlagPriority, number>} */
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(window.EyeVisionTestResult, {
  detectFlags
});
})();
