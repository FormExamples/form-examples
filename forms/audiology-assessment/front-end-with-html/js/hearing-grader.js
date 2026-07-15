import { hearingRules } from './hearing-rules.js';
import { GRADE_ORDER, classifyDbHL, worseGrade } from './types.js';

// Pure function: evaluates all hearing rules against patient data and
// returns the maximum grade among all fired rules and per-ear PTA
// classification, defaulting to 'normal' for patients with no fired rules.
//
// Mirrors src/lib/engine/hearing-grader.ts in the SvelteKit form.

function calculateHearingGrade(data) {
  const firedRules = [];

  for (const rule of hearingRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          system: rule.system,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      console.warn('Hearing rule ' + rule.id + ' evaluation failed:', e);
    }
  }

  // Determine grade from PTA values first (primary classification).
  const rightGrade = classifyDbHL(data.audiometricResults.pureToneAverageRight);
  const leftGrade = classifyDbHL(data.audiometricResults.pureToneAverageLeft);
  const ptaGrade = worseGrade(rightGrade, leftGrade);

  // Then consider fired rules that may elevate the grade.
  let hearingGrade = ptaGrade;
  if (firedRules.length > 0) {
    const maxRuleGrade = firedRules.reduce(function (max, r) {
      return GRADE_ORDER[r.grade] > GRADE_ORDER[max] ? r.grade : max;
    }, 'normal');
    hearingGrade = worseGrade(ptaGrade, maxRuleGrade);
  }

  return { hearingGrade, firedRules, ptaGrade, rightGrade, leftGrade };
}

export { calculateHearingGrade };
