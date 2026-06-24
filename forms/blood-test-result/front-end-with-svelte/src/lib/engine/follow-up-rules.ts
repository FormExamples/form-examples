import type {
	BloodTestResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasCriticalValue, hasAbnormalResult } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical (panic) value auto-escalates to critical-alert regardless of the
 * other axes (the safety invariant). An abnormal-but-not-critical result maps to
 * recommended. The least-urgent band is chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: BloodTestResult,
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
	if (hasCriticalValue(r) || classification === 'critical') {
		firedRules.push({
			ruleId: 'R-FU-CRITICAL-01',
			axis: 'follow-up',
			category: 'critical-value',
			description:
				'Critical (panic) value auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction:
				'Communicate the critical result directly to the requester now and document the conversation.',
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
	if (severity === 'moderate' || hasAbnormalResult(r)) {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'abnormal-result',
			description: 'Abnormal result present; follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction: 'Recommend repeat testing or specialist referral as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive study; repeat or supplementary testing recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction: 'Recommend repeat or supplementary testing to resolve the inconclusive result.',
			firedRules
		};
	}

	if (severity === 'minor') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'structured-band',
			description: 'A structured-reporting band deviates from normal; structured follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'per structured-reporting guidance',
			recommendedAction:
				'Manage per the relevant structured pathway (e.g. CKD or glycaemic monitoring guidance).',
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
		recommendedAction: 'No specific follow-up required; manage per usual care.',
		firedRules
	};
}
