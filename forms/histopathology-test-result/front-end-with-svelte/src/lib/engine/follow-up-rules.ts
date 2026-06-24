import type {
	HistopathologyResult,
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
 * critical finding (unexpected malignancy / involved margin) auto-escalates to
 * critical-alert regardless of the other axes (the safety invariant).
 * Confirmed malignancy drives urgent MDT discussion. The least-urgent band is
 * chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: HistopathologyResult,
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
				'Critical finding (unexpected malignancy or involved margin) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction:
				'Communicate the critical result directly to the requester now, refer to the urgent cancer MDT, and document the conversation.',
			firedRules
		};
	}

	// ─── urgent ───
	if (r.malignancyPresent || severity === 'major') {
		firedRules.push({
			ruleId: 'R-FU-URGENT-01',
			axis: 'follow-up',
			category: 'malignancy-mdt',
			description:
				'Confirmed malignancy or a major abnormality present; urgent MDT discussion required.'
		});
		return {
			followUpUrgency: 'urgent',
			targetTimeframe: 'within 2 weeks',
			recommendedAction:
				'Refer to the cancer multidisciplinary team (MDT) and expedite onward management per the 2-week-wait pathway.',
			firedRules
		};
	}

	// ─── recommended ───
	if (severity === 'moderate' || severity === 'minor') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'abnormal-finding',
			description: 'Abnormal structured finding present; follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction:
				'Recommend clinical correlation, MDT review, or further sampling as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive study; repeat or further sampling recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction:
				'Recommend a repeat or further specimen to resolve the inconclusive result.',
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
		recommendedAction: 'No specific pathology follow-up required; manage per usual care.',
		firedRules
	};
}
