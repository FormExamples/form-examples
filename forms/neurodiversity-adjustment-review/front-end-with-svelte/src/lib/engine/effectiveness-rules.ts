import type { NeurodiversityAdjustmentReview, EffectivenessBand, FiredRule } from './types';
import { ratedCount, ratedValues, workingWellCount, anyNotWorking } from './utils';

/**
 * Axis A — overall effectiveness of the adjustments in place.
 *
 * Classifies the mix of per-category effectiveness ratings onto a single band.
 * First match wins; exactly one rule fires. Rule IDs are stable and identical
 * across every front-end and the back-end.
 */
export function classifyEffectiveness(r: NeurodiversityAdjustmentReview): {
	effectivenessBand: EffectivenessBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const rated = ratedValues(r);

	// 1. Nothing rated → not-yet-assessed.
	if (ratedCount(r) === 0) {
		firedRules.push({
			ruleId: 'R-EFFECT-NOT-ASSESSED',
			axis: 'effectiveness',
			category: 'not-yet-assessed',
			description: 'No adjustments in place have been rated yet.'
		});
		return { effectivenessBand: 'not-yet-assessed', firedRules };
	}

	// 2. Every rated adjustment is working well → effective.
	if (rated.every((v) => v === 'working-well')) {
		firedRules.push({
			ruleId: 'R-EFFECT-EFFECTIVE',
			axis: 'effectiveness',
			category: 'effective',
			description: 'All rated adjustments are working well.'
		});
		return { effectivenessBand: 'effective', firedRules };
	}

	// 3. Nothing is working well and at least one is not working → ineffective.
	if (workingWellCount(r) === 0 && anyNotWorking(r)) {
		firedRules.push({
			ruleId: 'R-EFFECT-INEFFECTIVE',
			axis: 'effectiveness',
			category: 'ineffective',
			description: 'No adjustment is working well and at least one is not working.'
		});
		return { effectivenessBand: 'ineffective', firedRules };
	}

	// 4. Otherwise a mix → partially-effective.
	firedRules.push({
		ruleId: 'R-EFFECT-PARTIAL',
		axis: 'effectiveness',
		category: 'partially-effective',
		description: 'A mix of working and not-fully-working adjustments.'
	});
	return { effectivenessBand: 'partially-effective', firedRules };
}
