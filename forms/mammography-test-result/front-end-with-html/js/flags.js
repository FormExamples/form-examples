import { isBiRadsCritical, isBiRadsUrgent } from './rules.js';

// Safety-critical flag detection for the Mammography Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_mammography_test_result_grade_flag.sql`. A BI-RADS 4
// or 5 final assessment raises the abnormal-requiring-action and
// urgent-referral flags. Flags are returned sorted high → medium → low.

/**
 * @typedef {import('./types.js').MammographyResult} MammographyResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.MammographyTestResult.
// Depends on rules.js (isBiRadsUrgent / isBiRadsCritical), so it must load
// after it.

/**
 * Detect the safety-critical flags for a report.
 * @param {MammographyResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];
  const cat = r.biRadsCategory;

  // ─── critical-result-alert (BI-RADS 4c / 5 — high suspicion) ───
  if (isBiRadsCritical(cat)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description: `BI-RADS ${cat} (≥ 50 % likelihood of malignancy) is a critical result.`,
      suggestedAction:
        'Communicate the critical result to the referrer immediately and document the communication.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description: 'Critical BI-RADS result but it has not been recorded as communicated.',
        suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
      });
    }
  }

  // ─── abnormal-requiring-action / urgent-referral (BI-RADS 4 or 5) ───
  if (isBiRadsUrgent(cat) || isBiRadsCritical(cat)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: `BI-RADS ${cat} final assessment requires tissue diagnosis / action.`,
      suggestedAction: 'Ensure the referrer is alerted and an image-guided biopsy is arranged.'
    });
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'high',
      description: 'Suspected cancer — refer on a two-week-wait (2WW) breast pathway.',
      suggestedAction: 'Refer for image-guided biopsy and communicate to the breast MDT.'
    });
  }

  // ─── abnormal-requiring-action: symptomatic breast lump ───
  if (r.mass && (r.examType === 'symptomatic' || r.examType === 'diagnostic')) {
    flags.push({
      flagId: 'F-BREAST-LUMP-001',
      category: 'abnormal-requiring-action',
      priority: 'medium',
      description: 'A mass is reported on a symptomatic / diagnostic study (palpable breast lump).',
      suggestedAction: 'Correlate clinically and ensure triple assessment is completed.'
    });
  }

  // ─── abnormal-requiring-action: bloody / suspicious nipple discharge ───
  if (r.skinOrNippleChange) {
    flags.push({
      flagId: 'F-NIPPLE-CHANGE-001',
      category: 'abnormal-requiring-action',
      priority: 'medium',
      description: 'A skin or nipple change (e.g. retraction, bloody nipple discharge) is documented.',
      suggestedAction: 'Correlate with clinical examination; consider further imaging / referral.'
    });
  }

  // ─── urgent-referral: lymphadenopathy ───
  if (r.lymphadenopathy) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-002',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'Axillary or intramammary lymphadenopathy is present and may warrant urgent referral.',
      suggestedAction: 'Consider urgent referral and nodal assessment as clinically indicated.'
    });
  }

  // ─── inadequate-technique ───
  if (r.examinationAdequacy === 'non-diagnostic' || r.examinationAdequacy === 'limited') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.examinationAdequacy === 'non-diagnostic' ? 'high' : 'medium',
      description: `Examination adequacy is ${r.examinationAdequacy}; diagnostic confidence may be reduced.`,
      suggestedAction: 'Consider repeating or supplementing the examination to reach diagnostic quality.'
    });
  }

  // ─── discrepancy-with-request: screening study assigned BI-RADS 3-6 ───
  if (
    r.examType === 'screening' &&
    cat !== '' &&
    cat !== '0' &&
    cat !== '1' &&
    cat !== '2'
  ) {
    flags.push({
      flagId: 'F-DISCREPANCY-001',
      category: 'discrepancy-with-request',
      priority: 'medium',
      description: `A screening study has been assigned BI-RADS ${cat}; only 0/1/2 are valid for screening.`,
      suggestedAction: 'Recall for a complete diagnostic work-up before assigning BI-RADS 3-6.'
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
  if ((r.mass || r.architecturalDistortion) && r.largestLesionSizeMm === null) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'A mass or architectural distortion is reported but no measurement was recorded.',
      suggestedAction: 'Record the largest lesion long-axis size in millimetres for surveillance.'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (
    (r.mass || r.calcifications || r.architecturalDistortion) &&
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
