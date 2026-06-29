import type { AssessmentData, FiredRule, GradingResult } from './types';
import { oetRules } from './rules';
import { detectAdditionalFlags } from './flagged-issues';
import {
	LINGUISTIC_MAX,
	COMMUNICATION_MAX,
	RAW_MAX,
	linguisticTotal,
	communicationTotal,
	rawToScore,
	scoreToGrade,
	gradeOutcome
} from './utils';

/**
 * Pure function: scores the OET Speaking sub-test from the examiner's band
 * ratings. Sums the four linguistic bands (0-24) and five clinical-
 * communication bands (0-15), scales the combined raw total (0-39) to the
 * OET 0-500 score, derives the letter grade and pass/refer outcome, and
 * collects criterion weaknesses and safety/eligibility flags.
 */
export function calculateOetGrade(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];

	for (const rule of oetRules) {
		try {
			if (rule.evaluate(data)) {
				firedRules.push({
					id: rule.id,
					criterion: rule.criterion,
					description: rule.description,
					grade: rule.grade
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`OET rule ${rule.id} evaluation failed:`, e);
		}
	}

	const ling = linguisticTotal(data.linguisticCriteria);
	const comm = communicationTotal(data.clinicalCommunication);
	const rawTotal = ling + comm;
	const score = rawToScore(rawTotal);
	const grade = scoreToGrade(score);
	const outcome = gradeOutcome(grade);

	const additionalFlags = detectAdditionalFlags(data);

	return {
		linguisticTotal: ling,
		linguisticMax: LINGUISTIC_MAX,
		communicationTotal: comm,
		communicationMax: COMMUNICATION_MAX,
		rawTotal,
		score,
		grade,
		outcome,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}

/** Re-export for convenience. */
export { RAW_MAX };
