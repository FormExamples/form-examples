import type {
	MammographyResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { isBiRadsCritical, isBiRadsUrgent, hasOnlyIncidentalFinding } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert), driven
 * by the ACR BI-RADS management pathway:
 * - critical-alert: BI-RADS 4c / 5 (critical classification) auto-escalate
 *   regardless of the other axes — the safety invariant.
 * - urgent: BI-RADS 4a / 4b — tissue diagnosis / biopsy referral.
 * - recommended: BI-RADS 0 (further imaging), 3 (short-interval follow-up),
 *   6 (per agreed management), or a moderate/inconclusive study.
 * - routine: BI-RADS 1 / 2 (least-urgent band, only when no rule fires).
 */
export function gradeFollowUp(
	r: MammographyResult,
	classification: ResultClassification,
	severity: AbnormalitySeverity
): {
	followUpUrgency: FollowUpUrgency;
	targetTimeframe: string;
	recommendedAction: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const cat = r.biRadsCategory;

	// ─── critical-alert: BI-RADS 4c / 5 auto-escalation invariant ───
	if (isBiRadsCritical(cat) || classification === 'critical') {
		firedRules.push({
			ruleId: 'R-FU-CRITICAL-01',
			axis: 'follow-up',
			category: 'birads-critical',
			description:
				'BI-RADS 4c or 5 (highly suspicious) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'two-week-wait biopsy',
			recommendedAction:
				'Refer for image-guided biopsy and communicate to the breast MDT now; document the conversation.',
			firedRules
		};
	}

	// ─── urgent: BI-RADS 4a / 4b ───
	if (isBiRadsUrgent(cat)) {
		firedRules.push({
			ruleId: 'R-FU-URGENT-01',
			axis: 'follow-up',
			category: 'birads-suspicious',
			description: `BI-RADS ${cat} (suspicious); urgent tissue diagnosis / biopsy referral.`
		});
		return {
			followUpUrgency: 'urgent',
			targetTimeframe: 'two-week-wait biopsy',
			recommendedAction: 'Refer for tissue diagnosis / image-guided biopsy on a two-week-wait pathway.',
			firedRules
		};
	}

	// ─── recommended: BI-RADS 0 — further imaging ───
	if (cat === '0') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'birads-0',
			description: 'BI-RADS 0 (incomplete); additional imaging / prior comparison recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'additional imaging',
			recommendedAction:
				'Arrange additional imaging (further views / ultrasound) or obtain priors for comparison.',
			firedRules
		};
	}

	// ─── recommended: BI-RADS 3 — short-interval follow-up ───
	if (cat === '3') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'birads-3',
			description: 'BI-RADS 3 (probably benign); short-interval follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: '6-month short-interval',
			recommendedAction: 'Arrange short-interval (typically 6-month) follow-up imaging.',
			firedRules
		};
	}

	// ─── recommended: BI-RADS 6 — per agreed management ───
	if (cat === '6') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'birads-6',
			description: 'BI-RADS 6 (known malignancy); follow-up per agreed oncology / surgical management.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'per agreed management',
			recommendedAction: 'Continue per the agreed oncology / surgical management plan.',
			firedRules
		};
	}

	// ─── recommended: moderate abnormality (no BI-RADS assigned) ───
	if (severity === 'moderate' || severity === 'major') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-04',
			axis: 'follow-up',
			category: 'abnormal-finding',
			description: 'Abnormal finding without an assigned BI-RADS category; follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 2 weeks',
			recommendedAction: 'Assign a BI-RADS category and recommend follow-up imaging or referral.',
			firedRules
		};
	}

	// ─── recommended: inconclusive study ───
	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-05',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive study; repeat or additional imaging recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'additional imaging',
			recommendedAction: 'Recommend repeat or additional imaging to resolve the inconclusive study.',
			firedRules
		};
	}

	// ─── recommended: incidental finding ───
	if (hasOnlyIncidentalFinding(r)) {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-06',
			axis: 'follow-up',
			category: 'incidental-finding',
			description: 'Incidental finding; structured follow-up per incidental-findings guidance recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'per incidental-findings guidance',
			recommendedAction:
				'Manage the incidental finding per the relevant structured incidental-findings pathway.',
			firedRules
		};
	}

	// ─── routine: BI-RADS 1 / 2 or no escalation rule fired ───
	firedRules.push({
		ruleId: 'R-FU-ROUTINE-01',
		axis: 'follow-up',
		category: 'normal',
		description: 'No escalation rule fired; routine screening interval only.'
	});
	return {
		followUpUrgency: 'routine',
		targetTimeframe: 'routine screening interval',
		recommendedAction: 'Return to the routine screening interval; no specific follow-up required.',
		firedRules
	};
}
