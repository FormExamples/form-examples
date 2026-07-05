import type { NeurodiversityAdjustmentResponse, LegalRiskBand, FiredRule } from './types';
import { anyAgreed, hasAlternative, declineJustified } from './utils';

/** Band severity order (lowest → highest); the maximum fired band wins. */
const BAND_ORDER: Record<Exclude<LegalRiskBand, ''>, number> = {
	ok: 0,
	caution: 1,
	'high-risk': 2
};

/**
 * Axis B — legal / discrimination risk (reasonableness).
 *
 * Every rule below is evaluated; all that fire are recorded in the audit trail.
 * The final band is the maximum severity among the fired rules. When nothing
 * fires the band is `ok` and R-LEGAL-OK is emitted.
 *
 * Declining adjustments for a worker likely covered by the Equality Act 2010
 * without an adequate reasonableness justification or alternatives drives the
 * band to high-risk — the principal discrimination-risk signal.
 */
export function gradeLegalRisk(r: NeurodiversityAdjustmentResponse): {
	legalRiskBand: LegalRiskBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const declined = r.overallDecision === 'declined';
	const justified = declineJustified(r);

	if (declined && r.decisionRationale.trim() === '') {
		firedRules.push({
			ruleId: 'R-LEGAL-DECLINE-NO-RATIONALE',
			axis: 'legal-risk',
			category: 'high-risk',
			description:
				'Adjustments declined with no rationale recorded — high failure-to-make-reasonable-adjustments risk.'
		});
	}

	if (declined && !justified && !hasAlternative(r) && !anyAgreed(r)) {
		firedRules.push({
			ruleId: 'R-LEGAL-DECLINE-NO-ALTERNATIVE',
			axis: 'legal-risk',
			category: 'high-risk',
			description:
				'Adjustments declined without a reasonableness justification or any alternative offered.'
		});
	}

	if (r.escalated && declined) {
		firedRules.push({
			ruleId: 'R-LEGAL-ESCALATED-DECLINE',
			axis: 'legal-risk',
			category: 'high-risk',
			description:
				'Declined adjustment has been escalated — treat as a live discrimination-risk dispute.'
		});
	}

	if (declined && justified) {
		firedRules.push({
			ruleId: 'R-LEGAL-DECLINE-JUSTIFIED',
			axis: 'legal-risk',
			category: 'caution',
			description:
				'Adjustments declined but a reasonableness justification is recorded — retain evidence.'
		});
	}

	if (
		r.overallDecision === 'partially-agreed' &&
		!hasAlternative(r) &&
		r.declineReasonCategory === ''
	) {
		firedRules.push({
			ruleId: 'R-LEGAL-PARTIAL-UNEXPLAINED',
			axis: 'legal-risk',
			category: 'caution',
			description: 'Only part of the request agreed with no explanation for the remainder.'
		});
	}

	if (r.escalated) {
		firedRules.push({
			ruleId: 'R-LEGAL-ESCALATED',
			axis: 'legal-risk',
			category: 'caution',
			description: 'Matter escalated (dispute / grievance / appeal).'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-LEGAL-OK',
			axis: 'legal-risk',
			category: 'ok',
			description: 'No elevated discrimination risk detected.'
		});
		return { legalRiskBand: 'ok', firedRules };
	}

	let band: Exclude<LegalRiskBand, ''> = 'ok';
	for (const rule of firedRules) {
		const c = rule.category as Exclude<LegalRiskBand, ''>;
		if (c in BAND_ORDER && BAND_ORDER[c] > BAND_ORDER[band]) band = c;
	}
	return { legalRiskBand: band, firedRules };
}
