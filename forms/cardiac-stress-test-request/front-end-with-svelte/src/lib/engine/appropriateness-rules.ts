import type { FiredRule, AppropriatenessBand, Indication, TestType } from './types';

// ──────────────────────────────────────────────
// Axis A — Appropriateness (ACC/AHA Appropriate Use Criteria 1-9 ordinal)
//
// Each indication has an ideal test type (or set of types). When the requested
// test type matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score in the 4-6
// may-be-appropriate band; clearly mismatched pairings score 1-3.
// ──────────────────────────────────────────────

/** Map of indication → { ideal, plausible } test types. */
export const INDICATION_TEST_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-angina': {
		ideal: ['exercise-treadmill-ecg', 'stress-echo'],
		plausible: ['myocardial-perfusion-spect', 'stress-cardiac-mri', 'dobutamine-stress-echo']
	},
	'known-cad-assessment': {
		ideal: ['stress-echo', 'myocardial-perfusion-spect', 'stress-cardiac-mri'],
		plausible: ['dobutamine-stress-echo', 'exercise-treadmill-ecg']
	},
	'risk-stratification-post-mi': {
		ideal: ['myocardial-perfusion-spect', 'stress-echo'],
		plausible: ['stress-cardiac-mri', 'exercise-treadmill-ecg']
	},
	'pre-operative-cardiac': {
		ideal: ['stress-echo', 'myocardial-perfusion-spect'],
		plausible: ['dobutamine-stress-echo', 'exercise-treadmill-ecg', 'stress-cardiac-mri']
	},
	'exercise-tolerance': { ideal: ['exercise-treadmill-ecg'], plausible: ['stress-echo'] },
	'arrhythmia-evaluation': { ideal: ['exercise-treadmill-ecg'], plausible: ['stress-echo'] },
	'valve-disease': {
		ideal: ['stress-echo'],
		plausible: ['dobutamine-stress-echo', 'exercise-treadmill-ecg']
	},
	other: { ideal: [], plausible: [] }
};

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1-9) for an indication × testType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or test type has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: Indication,
	testType: TestType
): { score: number; band: AppropriatenessBand; firedRule: FiredRule | null } {
	if (!indication || !testType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or test type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_TEST_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(testType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${testType} is a recommended test for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(testType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${testType} may be appropriate for "${indication}" but is not the first-line test.`
			}
		};
	}
	if (indication === 'other') {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-OTHER',
				axis: 'appropriateness',
				category: 'other',
				description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
			}
		};
	}
	return {
		score: 2,
		band: 'usually-not-appropriate',
		firedRule: {
			ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${testType} is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}
