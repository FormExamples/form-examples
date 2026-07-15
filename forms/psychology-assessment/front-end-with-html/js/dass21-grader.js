import { dass21Rules } from './dass21-rules.js';

// DASS-21 grader. Pure functions: take an `AssessmentData` object, return
// per-subscale `SubscaleScore` records and the list of fired rules.
//
// Cutoffs (DASS-42 normative ranges; the doubled raw is what gets compared):
//   Depression: 0-9 normal / 10-13 mild / 14-20 moderate / 21-27 severe / 28+ extremely severe
//   Anxiety:    0-7  normal / 8-9   mild / 10-14 moderate / 15-19 severe / 20+ extremely severe
//   Stress:     0-14 normal / 15-18 mild / 19-25 moderate / 26-33 severe / 34+ extremely severe

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DassSeverity} DassSeverity
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').SubscaleScore} SubscaleScore
 */

/**
 * @param {number} scaled
 * @returns {DassSeverity}
 */
function classifyDassDepression(scaled) {
  if (scaled <= 9) return 'normal';
  if (scaled <= 13) return 'mild';
  if (scaled <= 20) return 'moderate';
  if (scaled <= 27) return 'severe';
  return 'extremely-severe';
}

/**
 * @param {number} scaled
 * @returns {DassSeverity}
 */
function classifyDassAnxiety(scaled) {
  if (scaled <= 7) return 'normal';
  if (scaled <= 9) return 'mild';
  if (scaled <= 14) return 'moderate';
  if (scaled <= 19) return 'severe';
  return 'extremely-severe';
}

/**
 * @param {number} scaled
 * @returns {DassSeverity}
 */
function classifyDassStress(scaled) {
  if (scaled <= 14) return 'normal';
  if (scaled <= 18) return 'mild';
  if (scaled <= 25) return 'moderate';
  if (scaled <= 33) return 'severe';
  return 'extremely-severe';
}

/**
 * @param {DassSeverity | ''} severity
 * @returns {string}
 */
function severityLabel(severity) {
  switch (severity) {
    case 'normal': return 'Normal';
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe': return 'Severe';
    case 'extremely-severe': return 'Extremely Severe';
    default: return '';
  }
}

/**
 * Evaluates DASS-21 across all 21 items.
 *
 * Sums each subscale's seven 0-3 item responses, then doubles the raw total
 * to align with published DASS-42 normative cutoffs. Unanswered items are
 * counted as 0 in the sum but tracked separately so callers can know
 * questionnaire completeness.
 *
 * @param {AssessmentData} data
 * @returns {{ depression: SubscaleScore, anxiety: SubscaleScore, stress: SubscaleScore, firedRules: FiredRule[] }}
 */
function calculateDass21(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const totals = { depression: 0, anxiety: 0, stress: 0 };
  const answered = { depression: 0, anxiety: 0, stress: 0 };

  for (const rule of dass21Rules) {
    try {
      const value = rule.evaluate(data);
      if (value !== null && value !== undefined) {
        totals[rule.subscale] += value;
        answered[rule.subscale]++;
        firedRules.push({
          id: rule.id,
          subscale: rule.subscale,
          itemNumber: rule.itemNumber,
          description: rule.description,
          score: value
        });
      }
    } catch (e) {
      console.warn(`DASS-21 rule ${rule.id} evaluation failed:`, e);
    }
  }

  /** @type {SubscaleScore} */
  const depression = {
    raw: totals.depression,
    scaled: totals.depression * 2,
    severity: classifyDassDepression(totals.depression * 2),
    answered: answered.depression
  };
  /** @type {SubscaleScore} */
  const anxiety = {
    raw: totals.anxiety,
    scaled: totals.anxiety * 2,
    severity: classifyDassAnxiety(totals.anxiety * 2),
    answered: answered.anxiety
  };
  /** @type {SubscaleScore} */
  const stress = {
    raw: totals.stress,
    scaled: totals.stress * 2,
    severity: classifyDassStress(totals.stress * 2),
    answered: answered.stress
  };

  return { depression, anxiety, stress, firedRules };
}

export { classifyDassDepression, classifyDassAnxiety, classifyDassStress, severityLabel, calculateDass21 };
