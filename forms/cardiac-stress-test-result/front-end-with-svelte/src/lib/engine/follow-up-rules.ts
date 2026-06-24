import type {
	CardiacStressResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasCriticalResult } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical result (strongly positive test, exertional hypotension, ischaemia at
 * low workload, or a high-risk Duke treadmill score) auto-escalates to
 * critical-alert with an urgent cardiology referral, regardless of the other
 * axes (the safety invariant). The least-urgent band is chosen only when no
 * rule fires.
 */
export function gradeFollowUp(
	r: CardiacStressResult,
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
	if (hasCriticalResult(r) || classification === 'critical') {
		firedRules.push({
			ruleId: 'R-FU-CRITICAL-01',
			axis: 'follow-up',
			category: 'critical-result',
			description:
				'Critical result auto-escalates follow-up urgency to critical-alert with an urgent cardiology referral, regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction:
				'Communicate the critical result directly to the referrer now and make an urgent cardiology referral; document the conversation.',
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
			recommendedAction: 'Arrange urgent cardiology review and expedite onward referral.',
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
			recommendedAction:
				'Recommend further functional or anatomical imaging or cardiology referral as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive study; repeat or alternative testing recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction:
				'Recommend repeat or alternative stress / imaging testing to resolve the inconclusive study.',
			firedRules
		};
	}

	if (severity === 'minor') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'minor-finding',
			description: 'Minor finding present; routine cardiology follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 6 weeks',
			recommendedAction:
				'Recommend routine cardiology follow-up; consider repeating the test to a maximal endpoint.',
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
		recommendedAction: 'No specific cardiac follow-up required; manage per usual care.',
		firedRules
	};
}
