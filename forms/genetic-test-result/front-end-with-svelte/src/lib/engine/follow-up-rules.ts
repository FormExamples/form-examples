import type {
	GeneticResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasPathogenicVariant, hasVus } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * pathogenic / likely-pathogenic actionable variant auto-escalates to
 * critical-alert regardless of the other axes (the safety invariant). The
 * least-urgent band is chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: GeneticResult,
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
	if (hasPathogenicVariant(r) || classification === 'critical') {
		firedRules.push({
			ruleId: 'R-FU-CRITICAL-01',
			axis: 'follow-up',
			category: 'pathogenic-variant',
			description:
				'Pathogenic / likely-pathogenic actionable variant auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction:
				'Communicate the actionable result to the referrer now, arrange urgent genetics MDT / counselling, and offer cascade testing of at-risk relatives.',
			firedRules
		};
	}

	// ─── urgent ───
	if (r.secondaryFinding) {
		firedRules.push({
			ruleId: 'R-FU-URGENT-01',
			axis: 'follow-up',
			category: 'secondary-finding',
			description: 'Actionable secondary finding present; follow-up urgency graded urgent.'
		});
		return {
			followUpUrgency: 'urgent',
			targetTimeframe: 'within 2 weeks',
			recommendedAction:
				'Arrange genetics review of the secondary finding and onward referral as clinically indicated.',
			firedRules
		};
	}

	// ─── recommended ───
	if (r.carrierStatusPositive) {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'carrier-status',
			description: 'Positive carrier status; genetic counselling recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 6 weeks',
			recommendedAction:
				'Offer genetic counselling and partner / reproductive carrier testing as appropriate.',
			firedRules
		};
	}

	if (hasVus(r) || classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'variant-uncertain-significance',
			description:
				'Variant of uncertain significance; re-contact / reclassification follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'periodic reclassification review',
			recommendedAction:
				'Recommend periodic variant reclassification review and re-contact if the classification changes.',
			firedRules
		};
	}

	if (severity === 'moderate') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'moderate-abnormality',
			description: 'Moderate abnormality present; follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 6 weeks',
			recommendedAction: 'Recommend genetics review or specialist referral as clinically indicated.',
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
		recommendedAction: 'No specific genetics follow-up required; manage per usual care.',
		firedRules
	};
}
