import type {
	ToxicologyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasToxicResult } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A toxic
 * result (paracetamol above the treatment line, or `toxicLevelPresent`)
 * auto-escalates to critical-alert regardless of the other axes (the safety
 * invariant), with an urgent antidote action (start N-acetylcysteine / NAC for
 * paracetamol). The least-urgent band is chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: ToxicologyResult,
	classification: ResultClassification,
	severity: AbnormalitySeverity
): {
	followUpUrgency: FollowUpUrgency;
	targetTimeframe: string;
	recommendedAction: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	// ─── critical-alert: auto-escalation invariant ───
	if (hasToxicResult(r) || classification === 'critical') {
		firedRules.push({
			ruleId: 'R-FU-CRITICAL-01',
			axis: 'follow-up',
			category: 'critical-result',
			description:
				'Toxic level auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		const paracetamol = r.paracetamolNomogram === 'above-treatment-line';
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction: paracetamol
				? 'Start N-acetylcysteine (NAC) now, communicate the critical result directly to the requester, and document the conversation.'
				: 'Start the appropriate antidote / urgent treatment now, communicate the critical result directly to the requester, and document the conversation.',
			firedRules
		};
	}

	// ─── urgent ───
	if (severity === 'major') {
		firedRules.push({
			ruleId: 'R-FU-URGENT-01',
			axis: 'follow-up',
			category: 'major-abnormality',
			description: 'Major abnormality present; follow-up urgency graded urgent.'
		});
		return {
			followUpUrgency: 'urgent',
			targetTimeframe: 'within 24 hours',
			recommendedAction: 'Arrange urgent clinical review and expedite onward referral.',
			firedRules
		};
	}

	// ─── recommended ───
	if (severity === 'moderate') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'moderate-abnormality',
			description: 'Moderate abnormality present; follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction: 'Recommend a repeat level or specialist review as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive study; repeat or alternative assay recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction: 'Recommend a repeat or alternative assay to resolve the inconclusive study.',
			firedRules
		};
	}

	// ─── routine: least-urgent band, no rule fired ───
	firedRules.push({
		ruleId: 'R-FU-ROUTINE-01',
		axis: 'follow-up',
		category: 'normal',
		description: 'No escalation rule fired; routine follow-up only.'
	});
	return {
		followUpUrgency: 'routine',
		targetTimeframe: 'no specific follow-up',
		recommendedAction: 'No specific toxicology follow-up required; manage per usual care.',
		firedRules
	};
}
