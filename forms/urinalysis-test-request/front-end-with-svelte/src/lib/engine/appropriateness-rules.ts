import type {
	UrinalysisRequest,
	AppropriatenessBand,
	FiredRule,
	Indication,
	TestField
} from './types';

/**
 * Axis A — appropriateness (1–9 ordinal, indication-to-test match).
 *
 * Each indication has a set of ideal tests (first-line, guideline-aligned) and
 * plausible tests (defensible but not first-line). A request is scored on the
 * best-matching selected test; anything not listed for an indication is a
 * mismatch. Anchored on NICE NG109, NICE NG12, and UK SMI B41.
 */
export const INDICATION_TEST_MAP: Record<string, { ideal: TestField[]; plausible: TestField[] }> = {
	'suspected-uti': { ideal: ['dipstick', 'microscopyCultureSensitivity'], plausible: ['pregnancyTest'] },
	haematuria: { ideal: ['dipstick', 'microscopyCultureSensitivity', 'cytology'], plausible: [] },
	proteinuria: {
		ideal: ['proteinCreatinineRatio', 'albuminCreatinineRatio'],
		plausible: ['dipstick', 'twentyFourHourCollection']
	},
	'diabetes-monitoring': {
		ideal: ['albuminCreatinineRatio'],
		plausible: ['dipstick', 'proteinCreatinineRatio']
	},
	'renal-monitoring': {
		ideal: ['albuminCreatinineRatio', 'proteinCreatinineRatio'],
		plausible: ['dipstick', 'twentyFourHourCollection', 'microscopyCultureSensitivity']
	},
	'pregnancy-screen': { ideal: ['pregnancyTest'], plausible: ['dipstick', 'microscopyCultureSensitivity'] },
	'pre-operative': { ideal: ['dipstick', 'pregnancyTest'], plausible: ['microscopyCultureSensitivity'] },
	'catheter-related': { ideal: ['microscopyCultureSensitivity'], plausible: ['dipstick'] },
	'suspected-malignancy': { ideal: ['cytology', 'microscopyCultureSensitivity'], plausible: ['dipstick'] },
	'drug-monitoring': { ideal: ['drugScreen'], plausible: [] },
	other: { ideal: [], plausible: [] }
};

/** List the camelCase keys of the currently-selected tests. */
export function selectedTestFields(r: UrinalysisRequest): TestField[] {
	const t = r.tests;
	return (Object.keys(t) as TestField[]).filter((k) => t[k] === true);
}

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1–9) for the indication × selected-tests pairing and
 * return the fired rules. Defaults to a neutral may-be-appropriate when the
 * indication or test panel has not yet been chosen. Rule IDs are stable and
 * identical across every front-end and the back-end.
 */
export function gradeAppropriateness(r: UrinalysisRequest): {
	score: number;
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const indication: Indication = r.context.primaryIndication;
	const selected = selectedTestFields(r);

	if (!indication || selected.length === 0) {
		return {
			score: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: indication || 'unspecified',
					description:
						'Indication or requested tests not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map = INDICATION_TEST_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	const matchesIdeal = selected.some((f) => map.ideal.includes(f));
	const matchesPlausible = selected.some((f) => map.plausible.includes(f));

	if (matchesIdeal) {
		return {
			score: 8,
			appropriatenessBand: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-IDEAL`,
					axis: 'appropriateness',
					category: indication,
					description: `A first-line test was requested for "${indication}".`
				}
			]
		};
	}
	if (matchesPlausible) {
		return {
			score: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
					axis: 'appropriateness',
					category: indication,
					description: `A requested test may be appropriate for "${indication}" but is not the first-line investigation.`
				}
			]
		};
	}
	if (indication === 'other') {
		return {
			score: 5,
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
		score: 2,
		appropriatenessBand: 'usually-not-appropriate',
		firedRules: [
			{
				ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
				axis: 'appropriateness',
				category: indication,
				description: `The requested tests are not usually appropriate for "${indication}"; query the referrer.`
			}
		]
	};
}
