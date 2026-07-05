import type {
	NeurodiversityAdjustmentReview,
	WellbeingRiskBand,
	NextStepUrgency,
	FiredRule
} from './types';
import { anyNotWorking } from './utils';

/**
 * Axis D — next-step urgency, plus the target timeframe.
 *
 * First match wins. An escalation, high wellbeing risk, or a failing / changing
 * adjustment auto-raise the urgency regardless of whether the next review is
 * booked; the least-urgent band (`none`) is chosen only when no rule fires.
 */
export function gradeNextStep(
	r: NeurodiversityAdjustmentReview,
	wellbeingRiskBand: WellbeingRiskBand
): {
	nextStepUrgency: NextStepUrgency;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (r.escalated) {
		firedRules.push({
			ruleId: 'R-NEXT-ESCALATED',
			axis: 'next-step',
			category: 'escalate',
			description: 'Escalation in progress — follow the escalation procedure.'
		});
		return {
			nextStepUrgency: 'escalate',
			targetTimeframe: 'Escalate now',
			firedRules
		};
	}

	if (wellbeingRiskBand === 'high-risk') {
		firedRules.push({
			ruleId: 'R-NEXT-HIGH-RISK',
			axis: 'next-step',
			category: 'adjust-now',
			description: 'High wellbeing risk — act now.'
		});
		return {
			nextStepUrgency: 'adjust-now',
			targetTimeframe: 'Within 2 weeks',
			firedRules
		};
	}

	if (anyNotWorking(r) || r.changesNeeded === true) {
		firedRules.push({
			ruleId: 'R-NEXT-CHANGES',
			axis: 'next-step',
			category: 'adjust-now',
			description: 'A failing adjustment or an agreed change needs action.'
		});
		return {
			nextStepUrgency: 'adjust-now',
			targetTimeframe: 'Within 2 weeks',
			firedRules
		};
	}

	if (r.nextReviewDate.trim() !== '') {
		firedRules.push({
			ruleId: 'R-NEXT-REVIEW-SCHEDULED',
			axis: 'next-step',
			category: 'review-scheduled',
			description: 'Next review is scheduled.'
		});
		return {
			nextStepUrgency: 'review-scheduled',
			targetTimeframe: r.nextReviewDate,
			firedRules
		};
	}

	firedRules.push({
		ruleId: 'R-NEXT-NONE',
		axis: 'next-step',
		category: 'none',
		description: 'No further action scheduled.'
	});
	return {
		nextStepUrgency: 'none',
		targetTimeframe: 'No follow-up scheduled',
		firedRules
	};
}
