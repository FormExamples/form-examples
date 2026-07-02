import type { AssessmentData, FiredCriterion, GradingResult, OttawaDecision } from './types';
import { ottawaRules, unableToBearWeight } from './ottawa-ankle-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the six Ottawa criteria and collect the ones whose finding is
 * positive. Criteria A3 and F3 share the derived unable-to-bear-weight input,
 * so both fire together when weight-bearing is absent; the shared derivation is
 * flattened to a single 'both'-region row so the report reads cleanly.
 */
export function evaluateCriteria(data: AssessmentData): FiredCriterion[] {
	const fired: FiredCriterion[] = [];
	let weightRowAdded = false;

	for (const rule of ottawaRules) {
		try {
			if (!rule.evaluate(data)) continue;
			if (rule.criterion === 'unable-to-bear-weight') {
				// A3 and F3 collapse to a single 'both' row (feeds both decisions).
				if (weightRowAdded) continue;
				weightRowAdded = true;
				fired.push({
					id: 'A3/F3',
					region: 'both',
					criterion: rule.criterion,
					description: rule.description
				});
				continue;
			}
			fired.push({
				id: rule.id,
				region: rule.region,
				criterion: rule.criterion,
				description: rule.description
			});
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Ottawa rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Pure function: compute the two independent Ottawa imaging decisions.
 *
 * Algorithm (spec §4):
 *   unableToBearWeight = ableToBearWeightImmediately == 'no'
 *                        && ableToBearWeightNow == 'no'
 *   ankleXrayIndicated = malleolarZonePain == 'yes'
 *     && ( lateralMalleolusTenderness == 'yes'
 *          || medialMalleolusTenderness == 'yes'
 *          || unableToBearWeight )
 *   footXrayIndicated  = midfootZonePain == 'yes'
 *     && ( fifthMetatarsalBaseTenderness == 'yes'
 *          || navicularTenderness == 'yes'
 *          || unableToBearWeight )
 *
 * The two decisions are independent (ankle only, foot only, both, or neither is
 * valid); `unableToBearWeight` feeds both. An unanswered ('') finding is treated
 * as negative for the decision itself; `flagged-issues.ts` raises a
 * data-completeness flag separately.
 */
export function calculateOttawaDecision(data: AssessmentData): OttawaDecision {
	const cannotBearWeight = unableToBearWeight(data);

	const ankleXrayIndicated =
		data.painZones.malleolarZonePain === 'yes' &&
		(data.ankleTenderness.lateralMalleolusTenderness === 'yes' ||
			data.ankleTenderness.medialMalleolusTenderness === 'yes' ||
			cannotBearWeight);

	const footXrayIndicated =
		data.painZones.midfootZonePain === 'yes' &&
		(data.footTenderness.fifthMetatarsalBaseTenderness === 'yes' ||
			data.footTenderness.navicularTenderness === 'yes' ||
			cannotBearWeight);

	return {
		unableToBearWeight: cannotBearWeight,
		ankleXrayIndicated,
		footXrayIndicated
	};
}

/** Compute the full Ottawa grade: the two decisions, fired criteria, and flags. */
export function gradeOttawaAnkleRules(data: AssessmentData): GradingResult {
	const decision = calculateOttawaDecision(data);
	const firedCriteria = evaluateCriteria(data);
	const flaggedIssues = detectFlaggedIssues(data, decision);

	return {
		...decision,
		firedCriteria,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
