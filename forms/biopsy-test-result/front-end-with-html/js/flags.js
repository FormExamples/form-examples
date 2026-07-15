import { hasCriticalFinding, hasInvolvedMargin } from './rules.js';

// Safety-flag detection. Faithful vanilla-JS port of the tested SvelteKit
// engine module `flagged-issues.ts`.
//
// Detects safety-critical flags independently of the four axes. Flag
// categories mirror sql/07_create_table_biopsy_test_result_grade_flag.sql.
// Flags are returned sorted high → medium → low priority.

/**
 * @typedef {import('./types.js').BiopsyResult} BiopsyResult
 * @typedef {import('./types.js').Flag} Flag
 */

// Wrapped in an IIFE; published via window.BiopsyTestResult.

/**
 * @param {BiopsyResult} r
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
        'A critical finding (unexpected malignancy or an involved resection margin) is present.',
      suggestedAction:
        'Communicate the critical result to the referrer immediately, refer to the urgent MDT, and document the communication.'
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

  // ─── abnormal-requiring-action (involved margin) ───
  if (hasInvolvedMargin(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'The resection margin is involved (tumour at the cut edge).',
      suggestedAction:
        'Ensure the referrer is alerted and discuss re-excision or further management at MDT.'
    });
  }

  // ─── urgent-referral (malignancy with lymphovascular invasion) ───
  if (r.malignancyPresent && r.lymphovascularInvasion) {
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description:
        'Malignancy with lymphovascular invasion is present and may warrant urgent referral.',
      suggestedAction:
        'Consider urgent referral to the appropriate cancer specialist team.'
    });
  }

  // ─── discrepancy-with-request (unexpected malignancy vs request) ───
  if (r.malignancyPresent && r.originatingRequestReference.trim() === '') {
    flags.push({
      flagId: 'F-DISCREPANCY-001',
      category: 'discrepancy-with-request',
      priority: 'medium',
      description:
        'Malignancy is present but no originating request reference is recorded.',
      suggestedAction:
        'Link the report to the originating request to support discrepancy review.'
    });
  }

  // ─── inadequate-technique (specimen adequacy) ───
  if (r.specimenAdequacy === 'inadequate' || r.specimenAdequacy === 'suboptimal') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.specimenAdequacy === 'inadequate' ? 'high' : 'medium',
      description:
        `Specimen adequacy is ${r.specimenAdequacy}; diagnostic confidence may be reduced.`,
      suggestedAction:
        'Consider repeat sampling or ancillary testing to reach a diagnostic standard.'
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

  // ─── missing-measurement (malignancy without a recorded grade) ───
  if (
    r.malignancyPresent &&
    (r.histologicalGrade === '' || r.histologicalGrade === 'not-applicable')
  ) {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'low',
      description: 'Malignancy is reported but no histological grade was recorded.',
      suggestedAction:
        'Record the histological differentiation grade for the cancer dataset.'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlags };
