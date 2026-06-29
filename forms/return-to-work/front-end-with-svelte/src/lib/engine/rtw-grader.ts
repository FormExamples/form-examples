import type {
	AssessmentData,
	FiredRule,
	FitnessStatement,
	GradingResult,
	RestrictionPriority
} from './types';
import { restrictionRules } from './restriction-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { gradeToPriority } from './utils';

/**
 * Pure function: computes the return-to-work fitness statement and the
 * restriction-priority grade from clinician input.
 *
 * - Fitness statement is the clinician's outcome selection, with the
 *   sign-off override applied when present. A blank outcome defaults to the
 *   conservative `not-fit` (no positive statement of fitness).
 * - Restriction priority uses the max-grade rule: the most severe fired
 *   adjustment rule sets the overall grade.
 */
export function calculateReturnToWork(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	for (const rule of restrictionRules) {
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
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Restriction rule ${rule.id} evaluation failed:`, e);
		}
	}

	const restrictionPriority = deriveRestrictionPriority(firedRules);
	const computedFitness = deriveFitness(data);
	const overridden =
		data.signOff.clinicianOverride === 'yes' && data.signOff.overrideOutcome !== '';
	const fitnessStatement: FitnessStatement = overridden
		? (data.signOff.overrideOutcome as FitnessStatement)
		: computedFitness;

	const additionalFlags = detectAdditionalFlags(data);

	return {
		fitnessStatement,
		computedFitness,
		overridden,
		restrictionPriority,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}

/** Derive the computed fitness statement from the clinician's outcome. */
function deriveFitness(data: AssessmentData): FitnessStatement {
	const outcome = data.fitness.outcome;
	if (outcome === 'fit' || outcome === 'may-be-fit' || outcome === 'not-fit') {
		return outcome;
	}
	// No positive statement of fitness → conservative default.
	return 'not-fit';
}

/** Derive the overall restriction priority via the max-grade rule. */
function deriveRestrictionPriority(firedRules: FiredRule[]): RestrictionPriority {
	const maxGrade = firedRules.length > 0 ? Math.max(...firedRules.map((r) => r.grade)) : 1;
	return gradeToPriority(maxGrade);
}
