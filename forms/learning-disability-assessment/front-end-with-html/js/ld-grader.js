import { ldRules, levelScore } from './rules.js';

// Learning-Disability adaptive-functioning grader. Pure functions: take
// an `AssessmentData` object, return the average adaptive-support score
// (0-3 per item, scaled across answered items), the SeverityCategory
// label, and the list of fired rules. Items the patient has not answered
// are excluded from the average but tracked separately.
//
// Severity cutoffs (mean score over answered items, 0-3):
//   < 1.0    -> Mild (independent with support in complex tasks)
//   1.0-1.99 -> Moderate (significant support with daily living)
//   2.0-2.59 -> Severe (substantial support; limited communication)
//   >= 2.6   -> Profound (very limited understanding; intensive support)
//
// These thresholds align with DSM-5-TR / ICD-11 functional descriptors.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').SeverityCategory} SeverityCategory
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.LearningDisabilityAssessment.

/**
 * Classify a mean adaptive score (0-3) into a severity category.
 * @param {number} mean
 * @returns {SeverityCategory}
 */
function classifyAdaptiveScore(mean) {
  if (mean >= 2.6) return 'profound';
  if (mean >= 2.0) return 'severe';
  if (mean >= 1.0) return 'moderate';
  return 'mild';
}

/**
 * Friendly label for a SeverityCategory.
 * @param {SeverityCategory} sev
 */
function severityLabel(sev) {
  switch (sev) {
    case 'mild':     return 'Mild Learning Disability';
    case 'moderate': return 'Moderate Learning Disability';
    case 'severe':   return 'Severe Learning Disability';
    case 'profound': return 'Profound Learning Disability';
    default:         return '';
  }
}

/**
 * One-line description for the severity category.
 * @param {SeverityCategory} sev
 */
function severityDescription(sev) {
  switch (sev) {
    case 'mild':     return 'Independent with support in complex tasks (DSM-5-TR mild range).';
    case 'moderate': return 'Needs significant support with daily living (DSM-5-TR moderate range).';
    case 'severe':   return 'Needs substantial support; limited communication (DSM-5-TR severe range).';
    case 'profound': return 'Very limited understanding and communication; intensive support (DSM-5-TR profound range).';
    default:         return '';
  }
}

/**
 * CSS class hint for the severity badge.
 * @param {SeverityCategory} sev
 */
function severityClass(sev) {
  switch (sev) {
    case 'mild':     return 'sev-mild';
    case 'moderate': return 'sev-moderate';
    case 'severe':   return 'sev-severe';
    case 'profound': return 'sev-profound';
    default:         return '';
  }
}

/**
 * Evaluate the 10-item adaptive-functioning section against the supplied
 * assessment data and produce the mean per-item score, severity category,
 * and per-item audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{ adaptiveScore: number, severityCategory: SeverityCategory,
 *             answeredCount: number, firedRules: FiredRule[] }}
 */
function calculateLD(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let total = 0;
  let answeredCount = 0;

  for (const rule of ldRules) {
    try {
      const probe = rule.evaluate(data);
      if (probe > 0) {
        // Probe is (levelScore + 1); recover the true 0-3 weight.
        const weight = probe - 1;
        answeredCount++;
        total += weight;
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          score: weight
        });
      }
    } catch (e) {
      console.warn(`LD rule ${rule.id} evaluation failed:`, e);
    }
  }

  // If no items answered, default to 0 (mild) so an empty submission
  // doesn't claim the most severe category by accident.
  const adaptiveScore = answeredCount === 0 ? 0 : total / answeredCount;
  const severityCategory = classifyAdaptiveScore(adaptiveScore);

  return {
    adaptiveScore: Math.round(adaptiveScore * 100) / 100,
    severityCategory,
    answeredCount,
    firedRules
  };
}

export { classifyAdaptiveScore, severityLabel, severityDescription, severityClass, calculateLD };
