import { mustRules } from './must-rules.js';

// Nutrition / MUST grader. Pure functions: take an `AssessmentData` object,
// return the total MUST score (0-6), the `MUSTRisk`, an overall
// `SeverityLevel`, and the list of fired rules. Items the patient has not
// answered contribute 0 to the total but are still counted only when answered
// (their score is excluded from the audit trail when unanswered).
//
// MUST total score interpretation:
//   0  -> low    (well-nourished)
//   1  -> medium (at risk)
//   >=2 -> high  (malnourished)
//
// Severity escalation rules (overall):
//   - Default severity = the MUST risk band ('low' | 'moderate' | 'high')
//   - If MUST risk is 'high' AND any of the following are true, severity is
//     escalated to 'critical' (severe malnutrition with complications):
//       * BMI < 16
//       * Weight loss > 15% of usual body weight
//       * Acutely ill with no intake for >5 days AND high MUST score
//       * Active swallowing difficulty WITH choking episodes
//       * Receiving parenteral nutrition

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').MUSTRisk} MUSTRisk
 * @typedef {import('./types.js').SeverityLevel} SeverityLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.NutritionAssessment.

/**
 * Classify a numeric MUST score (0-6) into a risk band.
 * @param {number} score
 * @returns {MUSTRisk}
 */
function classifyMUSTScore(score) {
  if (score >= 2) return 'high';
  if (score === 1) return 'medium';
  return 'low';
}

/**
 * Friendly label for a MUSTRisk.
 * @param {MUSTRisk} risk
 */
function mustRiskLabel(risk) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'medium': return 'Medium Risk';
    case 'high': return 'High Risk';
    default: return '';
  }
}

/**
 * Friendly label for a SeverityLevel.
 * @param {SeverityLevel} level
 */
function severityLabel(level) {
  switch (level) {
    case 'low': return 'Well-Nourished';
    case 'moderate': return 'At Risk of Malnutrition';
    case 'high': return 'Malnourished';
    case 'critical': return 'Severe Malnutrition with Complications';
    default: return '';
  }
}

/**
 * CSS class hint for the severity badge.
 * @param {SeverityLevel} level
 */
function severityClass(level) {
  switch (level) {
    case 'low': return 'severity-low';
    case 'moderate': return 'severity-moderate';
    case 'high': return 'severity-high';
    case 'critical': return 'severity-critical';
    default: return '';
  }
}

/**
 * Map a MUST risk band to a baseline severity level.
 * @param {MUSTRisk} risk
 * @returns {SeverityLevel}
 */
function mustRiskToSeverity(risk) {
  switch (risk) {
    case 'low': return 'low';
    case 'medium': return 'moderate';
    case 'high': return 'high';
    default: return 'low';
  }
}

/**
 * Decide whether to escalate to 'critical' severity given the assessment data
 * and the baseline severity from the MUST score.
 * @param {AssessmentData} d
 * @param {SeverityLevel} baseline
 * @returns {SeverityLevel}
 */
function escalateSeverity(d, baseline) {
  if (baseline !== 'high') return baseline;

  const bmi = d.anthropometricMeasurements.bmi;
  const weightLossPct = d.anthropometricMeasurements.weightLossPercent;

  if (bmi !== null && bmi !== undefined && bmi < 16) return 'critical';
  if (weightLossPct !== null && weightLossPct > 15) return 'critical';
  if (d.nutritionalScreening.acuteDisease === 'acutely-ill-no-intake-5d') {
    return 'critical';
  }
  if (
    d.swallowingOralHealth.swallowingDifficulty === 'yes' &&
    d.swallowingOralHealth.chokingEpisodes === 'yes'
  ) {
    return 'critical';
  }
  if (d.currentNutritionalSupport.parenteralNutrition === 'yes') {
    return 'critical';
  }
  return baseline;
}

/**
 * Evaluate the 3-step MUST screening against the supplied assessment data and
 * produce the total score, risk band, severity level, and per-step audit
 * trail.
 *
 * @param {AssessmentData} data
 * @returns {{ mustScore: number, mustRisk: MUSTRisk, severity: SeverityLevel,
 *            answeredCount: number, firedRules: FiredRule[] }}
 */
function calculateMUST(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let totalScore = 0;
  let answeredCount = 0;

  for (const rule of mustRules) {
    try {
      const score = rule.evaluate(data);
      if (score >= 0) {
        answeredCount++;
        totalScore += score;
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          score
        });
      }
    } catch (e) {
      console.warn(`MUST rule ${rule.id} evaluation failed:`, e);
    }
  }

  const mustScore = totalScore;
  const mustRisk = classifyMUSTScore(mustScore);
  const baselineSeverity = mustRiskToSeverity(mustRisk);
  const severity = escalateSeverity(data, baselineSeverity);

  return { mustScore, mustRisk, severity, answeredCount, firedRules };
}

export { classifyMUSTScore, mustRiskLabel, severityLabel, severityClass, mustRiskToSeverity, escalateSeverity, calculateMUST };
