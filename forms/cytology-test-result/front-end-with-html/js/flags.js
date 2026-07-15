import { hasCriticalFinding, hasLowGradeCategory } from './rules.js';

// Safety-critical flag detection for the Cytology Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Detects flags independently of the four
// axes. Flag categories mirror
// `sql/07_create_table_cytology_test_result_grade_flag.sql`. Flags are
// returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').CytologyResult} CytologyResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Wrapped in an IIFE; published via window.CytologyTestResult.
// Depends on rules.js (hasCriticalFinding, hasLowGradeCategory), so it must
// load after it.

/**
 * Detect the safety-critical flags for a report.
 * @param {CytologyResult} r
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
        'A critical finding (malignant cells, high-grade dyskaryosis, Thy5, or breast C5) is present.',
      suggestedAction:
        'Communicate the critical result to the referrer immediately, document the communication, and refer for urgent colposcopy / MDT review.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description:
          'Critical finding present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
      });
    }
  }

  // ─── suspected-cancer-2ww (urgent referral) ───
  if (r.malignancyPresent) {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'urgent-referral',
      priority: 'high',
      description: 'Malignant cells reported; this is a suspected-cancer (2-week-wait) result.',
      suggestedAction: 'Refer urgently on a suspected-cancer (2-week-wait) pathway.'
    });
  }

  // ─── abnormal-requiring-action (dysplasia, no malignancy) ───
  if (r.dysplasiaPresent && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'Dysplasia / dyskaryosis is present and requires timely action.',
      suggestedAction: 'Ensure the referrer is alerted and a clear colposcopy / follow-up plan is documented.'
    });
  }

  // ─── urgent-referral (low-grade / borderline / atypical category) ───
  if (hasLowGradeCategory(r) && !r.dysplasiaPresent && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'A borderline / low-grade / atypical category is present and may warrant referral.',
      suggestedAction: 'Consider colposcopy referral per the relevant screening protocol.'
    });
  }

  // ─── previous-high-grade-cytology (discrepancy with prior) ───
  if (
    /high-grade|high grade|malignant|cin\s?[23]|thy5|c5/i.test(r.comparisonWithPrevious)
  ) {
    flags.push({
      flagId: 'F-PREVIOUS-HIGH-GRADE-001',
      category: 'discrepancy-with-request',
      priority: 'medium',
      description:
        'Previous high-grade cytology / histology is recorded in the comparison; review for discrepancy.',
      suggestedAction:
        'Correlate with the previous high-grade result and discuss at MDT if the current result is discordant.'
    });
  }

  // ─── inadequate-technique (unsatisfactory specimen) ───
  if (r.specimenAdequacy === 'unsatisfactory') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: 'medium',
      description: 'Specimen adequacy is unsatisfactory; diagnostic confidence is reduced.',
      suggestedAction: 'Recommend a repeat specimen to reach diagnostic adequacy.'
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

  // ─── missing-measurement (category recorded but no reporting category) ───
  if (
    (r.malignancyPresent || r.dysplasiaPresent) &&
    r.reportingCategory.trim() === ''
  ) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'An abnormal finding is reported but no structured reporting category was recorded.',
      suggestedAction:
        'Record the structured reporting category (e.g. dyskaryosis grade, Thy or C category).'
    });
  }

  // ─── unexpected-finding (abnormal but no originating request linked) ───
  if (
    (r.malignancyPresent || r.dysplasiaPresent) &&
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
