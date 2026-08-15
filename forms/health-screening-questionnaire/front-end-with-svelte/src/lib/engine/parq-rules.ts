// PAR-Q+ (Physical Activity Readiness Questionnaire for Everyone), 2011
// revision, PAR-Q+ Collaboration / CSEP. See doc/parq-plus-and-auditc.md for
// the full instrument reference and rule IDs.

import type { FiredRule, HealthScreeningQuestionnaire, ParqPlusClearance } from './types';
import { rule } from './utils';

/** The 7 PAR-Q+ general health items, in instrument order. */
export function parqItems(data: HealthScreeningQuestionnaire): string[] {
	const p = data.parq;
	return [
		p.parqDiagnosedHeartCondition,
		p.parqChestPainAtRest,
		p.parqChestPainDuringActivity,
		p.parqDizzinessOrLossOfConsciousness,
		p.parqOtherChronicMedicalCondition,
		p.parqPrescribedMedicationForChronicCondition,
		p.parqBoneOrJointProblem
	];
}

/**
 * PAR-Q+ clearance: `cleared` when all 7 items are answered `no`.
 * `further-assessment-required` when any item is `yes`. `''` when the screen
 * has not been started (every item still unanswered).
 */
export function computeParqPlusClearance(data: HealthScreeningQuestionnaire): ParqPlusClearance {
	const items = parqItems(data);
	if (items.every((v) => v === '')) return '';
	if (items.some((v) => v === 'yes')) return 'further-assessment-required';
	if (items.every((v) => v === 'no')) return 'cleared';
	return '';
}

/** Fired-rule audit trail for the PAR-Q+ screen. */
export function evaluateParqPlus(data: HealthScreeningQuestionnaire): FiredRule[] {
	const clearance = computeParqPlusClearance(data);
	if (!clearance) return [];
	return [
		rule(
			'R-PARQ-CLEARANCE',
			'parq-plus',
			'PAR-Q+ general health screen',
			null,
			clearance,
			'parq-plus-clearance',
			clearance === 'cleared'
				? 'All 7 PAR-Q+ general health items are no: cleared for general physical activity.'
				: 'At least one PAR-Q+ general health item is yes: further assessment required before starting.'
		)
	];
}
