import type { GeneticTestRequest, ConsentCounsellingBand, FiredRule } from './types';
import { isPredictiveTest } from './utils';

/**
 * Axis B — consent & counselling (informed consent + pre-test counselling).
 *
 * Consent and pre-test counselling are MANDATORY for predictive /
 * presymptomatic testing: if either is absent the band is `not-met` and a
 * blocking flag fires. For other tests, missing consent or missing counselling
 * yields `caution`. The least-alarming band (`ok`) is chosen only when both are
 * documented.
 *
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function gradeConsentCounselling(r: GeneticTestRequest): {
	consentCounsellingBand: ConsentCounsellingBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const consent = r.consent.consentObtained === true;
	const counselling = r.consent.geneticCounsellingOffered === true;
	const predictive = isPredictiveTest(r.request.testType, r.request.primaryIndication);

	if (predictive && (!consent || !counselling)) {
		firedRules.push({
			ruleId: 'R-CONSENT-PREDICTIVE-NOT-MET',
			axis: 'consent',
			category: 'predictive',
			description:
				'Predictive / presymptomatic testing requires both documented informed consent and pre-test counselling; one or both are absent.'
		});
		return { consentCounsellingBand: 'not-met', firedRules };
	}

	if (!consent) {
		firedRules.push({
			ruleId: 'R-CONSENT-NOT-OBTAINED',
			axis: 'consent',
			category: 'consent',
			description: 'Informed consent (Record of Discussion) has not been documented.'
		});
		return { consentCounsellingBand: 'caution', firedRules };
	}

	if (!counselling) {
		firedRules.push({
			ruleId: 'R-CONSENT-COUNSELLING-NOT-OFFERED',
			axis: 'consent',
			category: 'counselling',
			description: 'Pre-test genetic counselling has not been recorded as offered or provided.'
		});
		return { consentCounsellingBand: 'caution', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CONSENT-OK',
		axis: 'consent',
		category: 'consent',
		description: 'Informed consent and pre-test counselling are both documented.'
	});
	return { consentCounsellingBand: 'ok', firedRules };
}
