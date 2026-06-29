import type { CardiologyRequest, AppropriatenessBand, FiredRule } from './types';
import { serviceMatchesReason } from './utils';

/**
 * Axis A — referral appropriateness.
 *
 * A right-service / right-reason check against NICE referral criteria:
 * - usually-appropriate: a recognised cardiac reason with a requested service
 *   that matches it (and a clinical question supplied).
 * - usually-not-appropriate: no reason supplied, or a clearly non-cardiac /
 *   self-resolving presentation routed to cardiology.
 * - may-be-appropriate: a cardiac reason but the requested service does not
 *   match, or the request lacks the clinical question needed to vet it.
 *
 * Returns the band plus the audit-trail rules that fired. Rule IDs are stable
 * and identical across every front-end and the back-end.
 */
export function gradeAppropriateness(r: CardiologyRequest): {
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	// No reason supplied → cannot justify a cardiology referral.
	if (r.referralReason === '') {
		firedRules.push({
			ruleId: 'R-APPROP-NO-REASON-01',
			axis: 'appropriateness',
			category: 'missing-reason',
			description:
				'No primary reason for referral supplied; the referral cannot be judged appropriate.'
		});
		return { appropriatenessBand: 'usually-not-appropriate', firedRules };
	}

	// Non-cardiac / context-light reasons routed to cardiology.
	if (r.referralReason === 'hypertension' && !r.symptomChestPain && !r.symptomBreathlessness) {
		firedRules.push({
			ruleId: 'R-APPROP-LOW-YIELD-01',
			axis: 'appropriateness',
			category: 'low-yield',
			description:
				'Uncomplicated hypertension without cardiac symptoms is usually managed in primary care, not cardiology.'
		});
		return { appropriatenessBand: 'usually-not-appropriate', firedRules };
	}

	// Recognised cardiac reason with a matching service and a clinical question.
	if (serviceMatchesReason(r) && r.clinicalQuestion.trim() !== '') {
		firedRules.push({
			ruleId: 'R-APPROP-MATCH-01',
			axis: 'appropriateness',
			category: 'right-service-right-reason',
			description:
				'A recognised cardiac reason with a matching requested service and a clinical question; usually appropriate.'
		});
		return { appropriatenessBand: 'usually-appropriate', firedRules };
	}

	// Cardiac reason but the requested service does not match the typical pathway.
	if (!serviceMatchesReason(r)) {
		firedRules.push({
			ruleId: 'R-APPROP-SERVICE-MISMATCH-01',
			axis: 'appropriateness',
			category: 'service-mismatch',
			description:
				'The requested service does not match the typical pathway for the referral reason; may be appropriate but consider redirection.'
		});
		return { appropriatenessBand: 'may-be-appropriate', firedRules };
	}

	// Matching service but no clinical question to vet against.
	firedRules.push({
		ruleId: 'R-APPROP-NO-QUESTION-01',
		axis: 'appropriateness',
		category: 'missing-clinical-question',
		description:
			'A cardiac reason with a matching service but no specific clinical question; may be appropriate pending clarification.'
	});
	return { appropriatenessBand: 'may-be-appropriate', firedRules };
}
