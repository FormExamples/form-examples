import type {
	CardiologyResponse,
	ResponseClassification,
	Severity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasCriticalFinding } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical result auto-escalates to critical-alert regardless of the other
 * axes (the safety invariant). The least-urgent band is chosen only when no
 * rule fires.
 */
export function gradeFollowUp(
	r: CardiologyResponse,
	classification: ResponseClassification,
	severity: Severity
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
			ruleId: 'R-FOLLOWUP-CRITICAL-01',
			axis: 'follow-up',
			category: 'critical-result',
			description:
				'Critical result auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction:
				'Communicate the critical result directly to the referrer now and arrange urgent review; document the conversation.',
			firedRules
		};
	}

	// ─── urgent ───
	if (severity === 'major') {
		firedRules.push({
			ruleId: 'R-FOLLOWUP-URGENT-01',
			axis: 'follow-up',
			category: 'major-condition',
			description: 'Major cardiac condition present; follow-up urgency graded urgent.'
		});
		return {
			followUpUrgency: 'urgent',
			targetTimeframe: 'within 2 weeks',
			recommendedAction:
				'Arrange urgent cardiology follow-up and expedite specialist management as clinically indicated.',
			firedRules
		};
	}

	// ─── recommended ───
	if (severity === 'moderate' || severity === 'minor') {
		firedRules.push({
			ruleId: 'R-FOLLOWUP-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'cardiac-condition',
			description: 'A cardiac condition is present; structured follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 6 weeks',
			recommendedAction:
				'Recommend routine cardiology follow-up or onward investigation as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FOLLOWUP-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive response; further assessment or investigation recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 6 weeks',
			recommendedAction:
				'Recommend further assessment or investigation to resolve the inconclusive response.',
			firedRules
		};
	}

	// ─── routine: least-urgent band, no rule fired ───
	firedRules.push({
		ruleId: 'R-FOLLOWUP-ROUTINE-01',
		axis: 'follow-up',
		category: 'no-abnormality',
		description: 'No escalation rule fired; routine follow-up only.'
	});
	return {
		followUpUrgency: 'routine',
		targetTimeframe: 'no specific follow-up',
		recommendedAction:
			'No specific cardiology follow-up required; discharge back to the referrer for usual care.',
		firedRules
	};
}
