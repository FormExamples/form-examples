import type {
	BloodCrossMatchResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasCriticalResult, insufficientUnits } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical result (incompatible crossmatch, clinically-significant antibodies,
 * ABO discrepancy, or unmet two-sample rule) auto-escalates to critical-alert
 * regardless of the other axes (the safety invariant). The least-urgent band is
 * chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: BloodCrossMatchResult,
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
				'A critical result (incompatible crossmatch, clinically-significant antibodies, ABO discrepancy, or unmet two-sample rule) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction:
				'Communicate the critical result directly to the requester now, withhold issue until resolved, and document the conversation.',
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
			targetTimeframe: 'within 1 hour',
			recommendedAction: 'Escalate to the consultant haematologist and expedite resolution before issue.',
			firedRules
		};
	}

	// ─── recommended ───
	if (severity === 'moderate' || insufficientUnits(r)) {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'moderate-abnormality',
			description: 'Moderate abnormality present; follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'before issue',
			recommendedAction:
				'Select antigen-negative units and/or order additional compatible units as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive work-up; repeat or complete testing recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'before issue',
			recommendedAction: 'Recommend a repeat sample or completion of testing to resolve the inconclusive work-up.',
			firedRules
		};
	}

	// ─── routine: least-urgent band, no rule fired ───
	firedRules.push({
		ruleId: 'R-FU-ROUTINE-01',
		axis: 'follow-up',
		category: 'compatible',
		description: 'No escalation rule fired; routine follow-up only.'
	});
	return {
		followUpUrgency: 'routine',
		targetTimeframe: 'no specific follow-up',
		recommendedAction: 'Issue compatible units per the standard transfusion pathway; manage per usual care.',
		firedRules
	};
}
