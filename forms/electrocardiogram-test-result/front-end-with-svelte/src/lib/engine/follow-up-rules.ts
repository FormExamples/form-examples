import type {
	ElectrocardiogramResult,
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
 * critical finding auto-escalates to critical-alert regardless of the other
 * axes (the safety invariant). The least-urgent band is chosen only when no
 * rule fires.
 */
export function gradeFollowUp(
	r: ElectrocardiogramResult,
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
				'Critical finding auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'same hour',
			recommendedAction:
				'Communicate the critical result directly to the responsible team now (same hour) and document the conversation.',
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
			recommendedAction: 'Arrange urgent clinical review and expedite cardiology referral.',
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
				'Recommend cardiology review or further investigation as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive study; repeat ECG recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction: 'Recommend a repeat ECG of adequate quality to resolve the inconclusive study.',
			firedRules
		};
	}

	if (severity === 'minor') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'minor-finding',
			description: 'Minor finding present; structured follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'routine clinic',
			recommendedAction: 'Correlate the minor finding clinically and follow up at routine review.',
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
		recommendedAction: 'No specific ECG follow-up required; manage per usual care.',
		firedRules
	};
}
