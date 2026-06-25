import type {
	HearingResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical finding — sudden sensorineural hearing loss (an otological
 * emergency) or marked asymmetry (retrocochlear red flag) — auto-escalates to
 * critical-alert regardless of the other axes (the safety invariant). The
 * least-urgent band is chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: HearingResult,
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
	if (hasCriticalFinding(r) || classification === 'critical') {
		firedRules.push({
			ruleId: 'R-FU-CRITICAL-01',
			axis: 'follow-up',
			category: 'critical-result',
			description:
				'Critical finding (sudden sensorineural loss or marked asymmetry) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		const action = r.suddenSensorineuralLoss
			? 'Refer urgently to ENT as an otological emergency and communicate the critical result to the referrer now.'
			: 'Refer urgently to ENT for MRI of the internal auditory meatus to exclude retrocochlear pathology, and communicate the critical result now.';
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction: action,
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
			targetTimeframe: 'within 2 weeks',
			recommendedAction: 'Arrange urgent ENT / audiology review and expedite onward referral.',
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
			targetTimeframe: 'within 6 weeks',
			recommendedAction:
				'Recommend hearing-aid assessment or specialist referral as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive test; repeat or alternative testing recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 6 weeks',
			recommendedAction: 'Recommend repeat or alternative audiological testing to resolve the inconclusive result.',
			firedRules
		};
	}

	if (severity === 'minor' || hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'minor-abnormality',
			description: 'Minor abnormality / hearing loss; structured audiology follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'per audiology pathway',
			recommendedAction:
				'Manage the hearing loss per the relevant audiology pathway (e.g. hearing-aid fitting, rehabilitation).',
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
		recommendedAction: 'No specific audiology follow-up required; manage per usual care.',
		firedRules
	};
}
