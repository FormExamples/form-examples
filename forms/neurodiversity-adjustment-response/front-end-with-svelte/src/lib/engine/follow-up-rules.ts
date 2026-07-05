import type {
	NeurodiversityAdjustmentResponse,
	LegalRiskBand,
	FollowUpUrgency,
	FiredRule
} from './types';
import { anyAgreed } from './utils';

/**
 * Axis D — follow-up / review urgency, plus the target timeframe.
 *
 * First match wins. Escalation and high legal risk auto-escalate the urgency
 * regardless of whether a review is booked; the least-urgent band (`none`) is
 * chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: NeurodiversityAdjustmentResponse,
	legalRiskBand: LegalRiskBand
): {
	followUpUrgency: FollowUpUrgency;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (r.escalated) {
		firedRules.push({
			ruleId: 'R-FOLLOWUP-ESCALATED',
			axis: 'follow-up',
			category: 'escalation-needed',
			description: 'Escalation in progress — engage HR / grievance procedure.'
		});
		return {
			followUpUrgency: 'escalation-needed',
			targetTimeframe: 'Escalate now',
			firedRules
		};
	}

	if (legalRiskBand === 'high-risk') {
		firedRules.push({
			ruleId: 'R-FOLLOWUP-LEGAL-RISK',
			axis: 'follow-up',
			category: 'urgent-review',
			description: 'High discrimination risk — reconsider the decision urgently.'
		});
		return {
			followUpUrgency: 'urgent-review',
			targetTimeframe: 'Within 2 weeks',
			firedRules
		};
	}

	if (r.reviewScheduled === true) {
		firedRules.push({
			ruleId: 'R-FOLLOWUP-REVIEW',
			axis: 'follow-up',
			category: 'review-scheduled',
			description: 'Review scheduled for the agreed adjustments.'
		});
		return {
			followUpUrgency: 'review-scheduled',
			targetTimeframe: r.reviewDate.trim() !== '' ? r.reviewDate : 'At the scheduled review',
			firedRules
		};
	}

	if (anyAgreed(r) && r.reviewScheduled === false) {
		firedRules.push({
			ruleId: 'R-FOLLOWUP-NO-REVIEW',
			axis: 'follow-up',
			category: 'urgent-review',
			description: 'Adjustments agreed but no review scheduled — schedule one.'
		});
		return {
			followUpUrgency: 'urgent-review',
			targetTimeframe: 'Within 2 weeks',
			firedRules
		};
	}

	firedRules.push({
		ruleId: 'R-FOLLOWUP-NONE',
		axis: 'follow-up',
		category: 'none',
		description: 'No follow-up scheduled.'
	});
	return {
		followUpUrgency: 'none',
		targetTimeframe: 'No follow-up scheduled',
		firedRules
	};
}
