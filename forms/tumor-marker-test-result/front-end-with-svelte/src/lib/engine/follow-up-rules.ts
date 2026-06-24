import type {
	TumorMarkerResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { isCriticalResult, hasActionSignal } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A very
 * high AFP / beta-hCG (germ-cell pattern), or a critical result, auto-escalates
 * to critical-alert regardless of the other axes (the safety invariant). A
 * markedly elevated value or a rising trend on treatment escalates to urgent
 * oncology review. The least-urgent band is chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: TumorMarkerResult,
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
	if (isCriticalResult(r) || classification === 'critical') {
		firedRules.push({
			ruleId: 'R-FU-CRITICAL-01',
			axis: 'follow-up',
			category: 'critical-result',
			description:
				'A critical result (very high AFP / beta-hCG, or reported critical) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction:
				'Communicate the critical result directly to the requester now and document the conversation; consider germ-cell tumour pathway.',
			firedRules
		};
	}

	// ─── urgent ───
	if (hasActionSignal(r) || severity === 'major') {
		firedRules.push({
			ruleId: 'R-FU-URGENT-01',
			axis: 'follow-up',
			category: 'action-signal',
			description:
				'A markedly elevated value or a rising trend on treatment is present; follow-up urgency graded urgent.'
		});
		return {
			followUpUrgency: 'urgent',
			targetTimeframe: 'within 1 week',
			recommendedAction: 'Arrange urgent oncology review and correlate with clinical context.',
			firedRules
		};
	}

	// ─── recommended ───
	if (severity === 'minor' || r.overallResultStatus === 'abnormal') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'mildly-raised',
			description: 'Mildly raised / abnormal result; repeat marker or specialist review recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 4 weeks',
			recommendedAction:
				'Recommend repeat tumour marker at the minimum retesting interval or specialist referral as clinically indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive result; repeat on a satisfactory specimen recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 4 weeks',
			recommendedAction: 'Recommend repeat assay on a satisfactory specimen to resolve the inconclusive result.',
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
		targetTimeframe: 'per minimum retesting interval',
		recommendedAction: 'No specific action required; manage per usual care and minimum retesting intervals.',
		firedRules
	};
}
