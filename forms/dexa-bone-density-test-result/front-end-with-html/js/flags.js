import { effectiveWhoClassification, hasCriticalFinding, hasOsteoporosis } from './rules.js';

// Safety-critical flag detection for the DEXA Bone Density Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine module
// `src/lib/engine/flagged-issues.ts`. Flag IDs, categories, priorities,
// descriptions, and suggested actions are stable and identical across every
// front-end and the back-end; categories mirror
// `sql/07_create_table_dexa_bone_density_test_result_grade_flag.sql`.

/**
 * @typedef {import('./types.js').DexaBoneDensityResult} DexaBoneDensityResult
 * @typedef {import('./types.js').Flag} Flag
 * @typedef {import('./types.js').FlagPriority} FlagPriority
 */

// Depends on rules.js (the structured-findings predicates), so it must load
// after it.

/**
 * Detects safety-critical flags independently of the four axes. Flags are
 * returned sorted high -> medium -> low priority.
 *
 * @param {DexaBoneDensityResult} r
 * @returns {Flag[]}
 */
function detectFlags(r) {
  /** @type {Flag[]} */
  const flags = [];

  // --- critical-result-alert (severe / established osteoporosis) ---
  if (hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-CRITICAL-RESULT-001',
      category: 'critical-result-alert',
      priority: 'high',
      description:
        'Severe (established) osteoporosis — T ≤ −2.5 with an identified fragility / vertebral fracture.',
      suggestedAction:
        'Communicate the result to the referrer and refer urgently for a fracture-risk treatment review.'
    });

    // critical result that has not yet been communicated
    if (!r.criticalResultCommunicated) {
      flags.push({
        flagId: 'F-CRITICAL-RESULT-002',
        category: 'critical-result-alert',
        priority: 'high',
        description:
          'Severe osteoporosis present but the result has not been recorded as communicated.',
        suggestedAction: 'Contact the referrer and record who was informed, with date and time.'
      });
    }
  }

  // --- abnormal-requiring-action (osteoporosis) / urgent-referral ---
  if (hasOsteoporosis(r) && !hasCriticalFinding(r)) {
    flags.push({
      flagId: 'F-ABNORMAL-ACTION-001',
      category: 'abnormal-requiring-action',
      priority: 'high',
      description: 'Osteoporosis (T ≤ −2.5) requiring fracture-risk treatment review.',
      suggestedAction: 'Refer for specialist treatment review and consider pharmacological therapy.'
    });
    flags.push({
      flagId: 'F-URGENT-REFERRAL-001',
      category: 'urgent-referral',
      priority: 'medium',
      description: 'Osteoporosis warrants onward referral for treatment review.',
      suggestedAction: 'Consider urgent referral to the metabolic-bone / fracture-liaison service.'
    });
  }

  // --- unexpected-finding (vertebral fracture without osteoporosis) ---
  if (r.vertebralFractureIdentified && !hasOsteoporosis(r)) {
    flags.push({
      flagId: 'F-UNEXPECTED-FINDING-001',
      category: 'unexpected-finding',
      priority: 'medium',
      description:
        'A vertebral fracture was identified without a T-score in the osteoporotic range.',
      suggestedAction:
        'Review fracture risk; a fragility fracture may itself indicate treatment irrespective of BMD.'
    });
  }

  // --- inadequate-technique ---
  if (r.examinationAdequacy === 'non-diagnostic' || r.examinationAdequacy === 'limited') {
    flags.push({
      flagId: 'F-INADEQUATE-TECHNIQUE-001',
      category: 'inadequate-technique',
      priority: r.examinationAdequacy === 'non-diagnostic' ? 'high' : 'medium',
      description: `Examination adequacy is ${r.examinationAdequacy}; diagnostic confidence may be reduced.`,
      suggestedAction:
        'Consider repeating or supplementing the examination to reach diagnostic quality.'
    });
  }

  // --- missing-impression ---
  if (r.impression.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-IMPRESSION-001',
      category: 'missing-impression',
      priority: 'medium',
      description: 'No impression / conclusion has been recorded.',
      suggestedAction: 'Add an impression that answers the clinical question.'
    });
  }

  // --- missing-measurement (no lowest T-score drives the classification) ---
  if (r.lowestTScore === null && effectiveWhoClassification(r) === '') {
    flags.push({
      flagId: 'F-MISSING-MEASUREMENT-001',
      category: 'missing-measurement',
      priority: 'medium',
      description:
        'No lowest T-score was recorded; the WHO densitometric classification cannot be derived.',
      suggestedAction:
        'Record the lowest (most negative) T-score across the measured skeletal sites.'
    });
  }

  // --- discrepancy-with-request (no originating request linked) ---
  if (hasOsteoporosis(r) && r.originatingRequestReference.trim() === '') {
    flags.push({
      flagId: 'F-DISCREPANCY-001',
      category: 'discrepancy-with-request',
      priority: 'low',
      description:
        'A significant densitometric finding is present but no originating request reference is recorded.',
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
