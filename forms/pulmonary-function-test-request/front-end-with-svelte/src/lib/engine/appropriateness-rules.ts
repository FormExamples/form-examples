import type { PulmonaryFunctionTestRequest, AppropriatenessBand, FiredRule } from './types';

/**
 * Axis A — appropriateness (NICE NG80 / NG115, ARTP indication match; 1–9).
 *
 * Each indication has an ideal test type (or set of types). When the requested
 * test type matches the indication well, the request scores high (7–9,
 * usually-appropriate). Plausible-but-suboptimal pairings score in the 4–6
 * may-be-appropriate band; clearly mismatched pairings score 1–3.
 */
const INDICATION_TEST_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-asthma': {
		ideal: ['spirometry-with-reversibility', 'feno'],
		plausible: ['spirometry', 'peak-flow']
	},
	'suspected-copd': {
		ideal: ['spirometry', 'spirometry-with-reversibility'],
		plausible: ['full-lung-function', 'gas-transfer-dlco']
	},
	breathlessness: {
		ideal: ['spirometry', 'full-lung-function'],
		plausible: ['gas-transfer-dlco', 'spirometry-with-reversibility']
	},
	'chronic-cough': {
		ideal: ['spirometry', 'feno'],
		plausible: ['spirometry-with-reversibility', 'peak-flow']
	},
	'pre-operative': {
		ideal: ['spirometry', 'full-lung-function'],
		plausible: ['gas-transfer-dlco']
	},
	'occupational-lung-disease': {
		ideal: ['peak-flow', 'spirometry'],
		plausible: ['full-lung-function', 'gas-transfer-dlco']
	},
	monitoring: {
		ideal: ['spirometry', 'peak-flow'],
		plausible: ['spirometry-with-reversibility', 'full-lung-function']
	},
	'restrictive-disease': {
		ideal: ['full-lung-function', 'gas-transfer-dlco'],
		plausible: ['spirometry']
	},
	other: { ideal: [], plausible: [] }
};

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBandForScore(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1–9) for an indication × testType pairing and return
 * the band plus the fired rule. Defaults to a neutral may-be-appropriate when
 * the indication or test type has not yet been chosen. Rule IDs are stable and
 * identical across every front-end and the back-end.
 */
export function gradeAppropriateness(r: PulmonaryFunctionTestRequest): {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const indication = r.request.primaryIndication;
	const testType = r.request.testType;

	if (!indication || !testType) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: indication || 'unspecified',
					description: 'Indication or test type not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map = INDICATION_TEST_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(testType)) {
		return {
			appropriatenessScore: 8,
			appropriatenessBand: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-IDEAL`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${testType} test is the recommended first-line investigation for "${indication}".`
				}
			]
		};
	}
	if (map.plausible.includes(testType)) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${testType} test may be appropriate for "${indication}" but is not the first-line investigation.`
				}
			]
		};
	}
	if (indication === 'other') {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-OTHER',
					axis: 'appropriateness',
					category: 'other',
					description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
				}
			]
		};
	}
	return {
		appropriatenessScore: 2,
		appropriatenessBand: 'usually-not-appropriate',
		firedRules: [
			{
				ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${testType} test is not usually appropriate for "${indication}"; query the referrer.`
			}
		]
	};
}
