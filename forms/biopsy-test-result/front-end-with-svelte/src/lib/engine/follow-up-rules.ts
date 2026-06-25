import type {
	BiopsyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasCriticalFinding } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical finding (unexpected malignancy or an involved resection margin)
 * auto-escalates to critical-alert / urgent MDT regardless of the other axes
 * (the safety invariant). The least-urgent band is chosen only when no rule
 * fires.
 */
export function gradeFollowUp(
	r: BiopsyResult,
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
				'Critical finding auto-escalates follow-up urgency to critical-alert and urgent MDT regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction:
				'Communicate the critical result directly to the referrer now, document the conversation, and refer to the urgent MDT.',
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
			targetTimeframe: 'within 1 week',
			recommendedAction: 'Refer to the relevant cancer MDT and expedite onward management.',
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
			recommendedAction: 'Recommend MDT discussion or specialist referral as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive specimen; repeat sampling or further testing recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction: 'Recommend repeat biopsy or ancillary testing to resolve the inconclusive specimen.',
			firedRules
		};
	}

	if (severity === 'minor') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'minor-abnormality',
			description: 'Minor abnormality present; structured follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'per local pathway',
			recommendedAction:
				'Manage the low-grade finding per the relevant structured follow-up pathway.',
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
		recommendedAction: 'No specific histopathology follow-up required; manage per usual care.',
		firedRules
	};
}
