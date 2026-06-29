import type { AssessmentData, GoldStage, AbcdGroup, FiredRule, GradingResult } from './types';
import { goldRules } from './gold-rules';
import { determineAbcdGroup } from './utils';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure function: evaluates all GOLD rules against patient data.
 * Returns the maximum stage among all fired rules (worst severity),
 * defaulting to GOLD I when spirometry confirms obstruction but no higher rules fire.
 * Also computes the ABCD group classification.
 */
export function calculateGold(data: AssessmentData): {
	goldStage: GoldStage;
	abcdGroup: AbcdGroup;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	for (const rule of goldRules) {
		try {
			if (rule.evaluate(data)) {
				firedRules.push({
					id: rule.id,
					system: rule.system,
					description: rule.description,
					stage: rule.stage
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading
			console.warn(`GOLD rule ${rule.id} evaluation failed:`, e);
		}
	}

	const goldStage: GoldStage =
		firedRules.length === 0
			? 1
			: (Math.max(...firedRules.map((r) => r.stage)) as GoldStage);

	const abcdGroup = determineAbcdGroup(
		data.symptomAssessment.catScore,
		data.symptomAssessment.mmrcDyspnoea,
		data.exacerbationHistory.exacerbationsPerYear,
		data.exacerbationHistory.hospitalizationsPerYear
	) as AbcdGroup;

	return { goldStage, abcdGroup, firedRules };
}

/**
 * Full grading entry point: computes the GOLD stage, ABCD group, fired rules,
 * and additional safety flags, stamping the result with the time of grading.
 * Both the wizard and the dashboard derive their output from this one function.
 */
export function gradeAssessment(data: AssessmentData): GradingResult {
	const { goldStage, abcdGroup, firedRules } = calculateGold(data);
	const additionalFlags = detectAdditionalFlags(data);
	return {
		goldStage,
		abcdGroup,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
