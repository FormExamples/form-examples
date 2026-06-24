import type {
	DexaBoneDensityResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { effectiveWhoClassification, hasCriticalFinding } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert), driven
 * by the WHO densitometric classification:
 * - normal (T ≥ −1.0) → routine.
 * - osteopenia (−1.0 > T > −2.5) → recommended.
 * - osteoporosis (T ≤ −2.5) → urgent.
 * - severe osteoporosis (T ≤ −2.5 + fragility / vertebral fracture) →
 *   critical-alert (auto-escalation invariant, regardless of the other axes).
 *
 * The least-urgent band is chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: DexaBoneDensityResult,
	classification: ResultClassification,
	severity: AbnormalitySeverity
): {
	followUpUrgency: FollowUpUrgency;
	targetTimeframe: string;
	recommendedAction: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const who = effectiveWhoClassification(r);

	// ─── critical-alert: auto-escalation invariant ───
	if (hasCriticalFinding(r) || classification === 'critical') {
		firedRules.push({
			ruleId: 'R-FU-CRITICAL-01',
			axis: 'follow-up',
			category: 'severe-osteoporosis',
			description:
				'Severe (established) osteoporosis auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'urgent — within days',
			recommendedAction:
				'Communicate the result to the referrer and refer urgently for a fracture-risk treatment review.',
			firedRules
		};
	}

	// ─── urgent ───
	if (who === 'osteoporosis') {
		firedRules.push({
			ruleId: 'R-FU-URGENT-01',
			axis: 'follow-up',
			category: 'osteoporosis',
			description: 'Osteoporosis (T ≤ −2.5); follow-up urgency graded urgent.'
		});
		return {
			followUpUrgency: 'urgent',
			targetTimeframe: 'within 4 weeks',
			recommendedAction:
				'Refer for specialist osteoporosis / fracture-risk treatment review and consider pharmacological therapy.',
			firedRules
		};
	}

	// ─── recommended ───
	if (who === 'osteopenia') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'osteopenia',
			description: 'Osteopenia (low bone mass); follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 3 months',
			recommendedAction:
				'Assess fracture risk (FRAX), advise lifestyle / bone-health measures, and arrange interval monitoring.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive study; repeat or alternative assessment recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 3 months',
			recommendedAction:
				'Recommend a repeat or alternative-site DEXA to resolve the inconclusive study.',
			firedRules
		};
	}

	// ─── routine: least-urgent band, no rule fired ───
	firedRules.push({
		ruleId: 'R-FU-ROUTINE-01',
		axis: 'follow-up',
		category: 'normal',
		description: 'Normal bone density; routine follow-up only.'
	});
	return {
		followUpUrgency: 'routine',
		targetTimeframe: 'no specific follow-up',
		recommendedAction:
			'No specific DEXA follow-up required; manage fracture risk per usual care.',
		firedRules
	};
}
