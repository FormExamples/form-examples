// NICE CG156 Fertility grader. Pure functions: take an `AssessmentData`
// object, fire each rule, and produce an overall concern level (Low /
// Moderate / High) plus the audit trail of fired rules.
//
// Concern level cutoffs (sum of fired rule weights):
//   0..2   -> low concern
//   3..6   -> moderate concern
//   >= 7   -> high concern

import type { AssessmentData, ConcernLevel, FiredRule, GradingResult } from './types';
import { fertilityRules } from './rules';
import { detectAdditionalFlags } from './flagged-issues';

/** Classify a numeric concern score into a category. */
export function classifyConcernScore(score: number): ConcernLevel {
	if (score >= 7) return 'high';
	if (score >= 3) return 'moderate';
	return 'low';
}

/**
 * Pure function: evaluates all NICE CG156 fertility rules against patient data.
 * Returns the concern score, concern level, fired rules, and flagged issues.
 */
export function calculateConcern(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	let totalScore = 0;

	for (const rule of fertilityRules) {
		try {
			if (rule.evaluate(data)) {
				totalScore += rule.weight;
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					score: rule.weight
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Fertility rule ${rule.id} evaluation failed:`, e);
		}
	}

	const concernLevel = classifyConcernScore(totalScore);
	const additionalFlags = detectAdditionalFlags(data);

	return {
		concernScore: totalScore,
		concernLevel,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
