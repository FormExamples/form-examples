// ASA Physical Status Classification rules.
//
// The clinician selects ASA I-VI directly. The risk mapping promotes the
// class to a four-band perioperative risk level used by the composite grader.
//
// ASA-001 — class I-II = low; III = medium; IV = high; V-VI = critical.

import type { AssessmentData, AsaClass, AsaResult, RiskLevel } from './types';
import { asaClassLabel } from './utils';

/** Risk level for a given ASA class. Returns 'low' for an empty class. */
export function asaRiskFromClass(klass: AsaClass): RiskLevel {
	switch (klass) {
		case 'i':
		case 'ii':
			return 'low';
		case 'iii':
			return 'medium';
		case 'iv':
			return 'high';
		case 'v':
		case 'vi':
			return 'critical';
		default:
			return 'low';
	}
}

/**
 * Evaluate ASA scoring for the given assessment. Returns the selected class,
 * an emergency flag, the resulting risk level, and the audit-trail rule entry.
 */
export function evaluateAsa(d: AssessmentData): AsaResult {
	const klass = d.investigationsAndPlan.asaClass;
	const emergency = d.investigationsAndPlan.emergencyCase === 'yes';
	const riskLevel = asaRiskFromClass(klass);
	const firedRules = [];
	if (klass) {
		firedRules.push({
			id: 'ASA-001',
			category: 'ASA Physical Status',
			description: `${asaClassLabel(klass)}${emergency ? ' (Emergency)' : ''}`,
			riskLevel
		});
	}
	return { class: klass, emergency, riskLevel, firedRules };
}
