import { detectAdditionalFlags } from './flagged-issues.js';
import { evaluateRules } from './risk-rules.js';
import { isLikelyDraft } from './utils.js';

// SCORE2-Diabetes - Pure scoring engine: combines fired rules into a
// summary risk category and gathers safety flags.

/**
 * Returns risk category and the rules that fired. The category is the
 * maximum severity among fired rules (high -> veryHigh, medium -> high,
 * low -> moderate). When no rules fire, the category is "low".
 */
function calculateRisk(data) {
  if (isLikelyDraft(data)) {
    return { riskCategory: 'draft', firedRules: [] };
  }

  const firedRules = evaluateRules(data);
  const riskOrder = (level) => {
    switch (level) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      default: return 0;
    }
  };

  let riskCategory;
  if (firedRules.length === 0) {
    riskCategory = 'low';
  } else {
    const maxLevel = firedRules.reduce(
      (max, r) => (riskOrder(r.riskLevel) > riskOrder(max) ? r.riskLevel : max),
      'low'
    );
    switch (maxLevel) {
      case 'high': riskCategory = 'veryHigh'; break;
      case 'medium': riskCategory = 'high'; break;
      default: riskCategory = 'moderate'; break;
    }
  }

  return { riskCategory, firedRules };
}

/** Full grading: risk + flags + timestamp. */
function gradeAssessment(data) {
  const { riskCategory, firedRules } = calculateRisk(data);
  const additionalFlags = detectAdditionalFlags(data);
  return {
    riskCategory,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
}

export { calculateRisk, gradeAssessment };
