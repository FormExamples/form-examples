import type {
	AmbulatoryBloodPressureResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasCriticalFinding, recordingIsInadequate } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * severe-hypertension result auto-escalates to critical-alert regardless of the
 * other axes (the safety invariant; NICE NG136 same-day specialist review). The
 * least-urgent band is chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: AmbulatoryBloodPressureResult,
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
				'Severe hypertension auto-escalates follow-up urgency to critical-alert regardless of the other axes (NICE NG136 same-day specialist review).'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'same-day',
			recommendedAction:
				'Arrange same-day specialist review and communicate the critical result directly to the referrer now; document the conversation.',
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
			recommendedAction: 'Arrange urgent clinical review and expedite treatment escalation.',
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
			targetTimeframe: 'within 4 weeks',
			recommendedAction:
				'Recommend antihypertensive treatment initiation or review per NICE NG136.',
			firedRules
		};
	}

	if (classification === 'inconclusive' || recordingIsInadequate(r)) {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inadequate-recording',
			description: 'Inconclusive or inadequate recording; repeat monitoring recommended.',
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 4 weeks',
			recommendedAction: 'Recommend repeat ambulatory or home monitoring to obtain an adequate study.',
			firedRules
		};
	}

	if (severity === 'minor') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'minor-abnormality',
			description: 'Minor abnormality (stage 1, nocturnal, or white-coat); structured follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 3 months',
			recommendedAction:
				'Recommend lifestyle advice and follow-up monitoring per NICE NG136; consider treatment by cardiovascular risk.',
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
