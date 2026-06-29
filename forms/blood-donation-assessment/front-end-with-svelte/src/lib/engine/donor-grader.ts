import type { AssessmentData, EligibilityStatus, FiredRule, GradingResult } from './types';
import { dsgRules } from './donor-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { countAnswered } from './utils';

/**
 * Run all JPAC Donor Selection Guidelines (DSG) rules against the supplied
 * data and reduce them to an overall eligibility status.
 *
 * Status hierarchy (most severe wins):
 *   permanently-deferred  >  temporarily-deferred  >  eligible
 */
export function gradeDonor(data: AssessmentData): {
	eligibilityStatus: EligibilityStatus;
	deferralWindow: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	for (const rule of dsgRules) {
		try {
			const fired = rule.evaluate(data);
			if (fired) firedRules.push(fired);
		} catch (e) {
			console.warn(`DSG rule ${rule.id} evaluation failed:`, e);
		}
	}

	let eligibilityStatus: EligibilityStatus = 'eligible';
	let deferralWindow = '';

	for (const r of firedRules) {
		if (r.status === 'permanently-deferred') {
			eligibilityStatus = 'permanently-deferred';
			deferralWindow = '';
			break;
		}
		if (r.status === 'temporarily-deferred') {
			eligibilityStatus = 'temporarily-deferred';
			// Keep the first temporary deferral window we see.
			if (!deferralWindow && r.deferralWindow) {
				deferralWindow = r.deferralWindow;
			}
		}
	}

	return { eligibilityStatus, deferralWindow, firedRules };
}

/**
 * Pure function: grades the donor end-to-end. Returns the eligibility status,
 * the deferral window, every fired DSG rule, the clinician-facing flagged
 * issues, the answered-field count, and a timestamp.
 */
export function calculateDonorGrade(data: AssessmentData): GradingResult {
	const { eligibilityStatus, deferralWindow, firedRules } = gradeDonor(data);
	const additionalFlags = detectAdditionalFlags(data);

	return {
		eligibilityStatus,
		deferralWindow,
		firedRules,
		additionalFlags,
		answeredCount: countAnswered(data),
		timestamp: new Date().toISOString()
	};
}
