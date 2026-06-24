import type {
	CytologyResult,
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
 * critical finding (malignant cells, high-grade dyskaryosis, Thy5, breast C5)
 * auto-escalates to critical-alert regardless of the other axes (the safety
 * invariant), recommending urgent colposcopy / MDT referral. The least-urgent
 * band is chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: CytologyResult,
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
			targetTimeframe: 'immediate',
			recommendedAction:
				'Communicate the critical result directly to the referrer now, document the conversation, and refer for urgent colposcopy / MDT review.',
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
			recommendedAction: 'Arrange urgent colposcopy / specialist referral on a 2-week-wait pathway.',
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
				'Recommend colposcopy referral or repeat cytology per the relevant screening protocol.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive / unsatisfactory specimen; repeat sampling recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 3 months',
			recommendedAction: 'Recommend repeat specimen to resolve the inadequate / inconclusive result.',
			firedRules
		};
	}

	if (r.hpvResult === 'positive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'hpv-positive',
			description: 'HPV positive; early recall / surveillance recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'early recall (12 months)',
			recommendedAction:
				'Manage per the HPV-surveillance pathway with early recall for repeat HPV testing.',
			firedRules
		};
	}

	// ─── routine: least-urgent band, no rule fired ───
	firedRules.push({
		ruleId: 'R-FU-ROUTINE-01',
		axis: 'follow-up',
		category: 'normal',
		description: 'No escalation rule fired; routine recall only.'
	});
	return {
		followUpUrgency: 'routine',
		targetTimeframe: 'routine recall',
		recommendedAction: 'No specific follow-up required; return to routine recall.',
		firedRules
	};
}
