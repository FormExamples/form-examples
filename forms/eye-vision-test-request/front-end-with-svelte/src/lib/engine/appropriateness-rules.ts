import type { EyeVisionRequest, AppropriatenessBand, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis A — Appropriateness (RCOphth / NICE indication match, 1-9 ordinal)
//
// Each indication has an ideal test type (or set of types). When the requested
// test type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.
// ──────────────────────────────────────────────

/** Map of indication -> { ideal:[testType], plausible:[testType] }. */
export const INDICATION_TEST_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'reduced-vision': {
		ideal: ['visual-acuity', 'refraction'],
		plausible: ['slit-lamp', 'fundus-examination', 'optical-coherence-tomography']
	},
	'suspected-glaucoma': {
		ideal: ['tonometry', 'visual-fields', 'optical-coherence-tomography'],
		plausible: ['fundus-examination']
	},
	'diabetic-retinopathy-screening': {
		ideal: ['fundus-examination', 'optical-coherence-tomography'],
		plausible: ['fluorescein-angiography', 'visual-acuity']
	},
	'sudden-visual-loss': {
		ideal: ['fundus-examination', 'visual-acuity'],
		plausible: ['visual-fields', 'optical-coherence-tomography', 'slit-lamp']
	},
	'flashes-floaters': {
		ideal: ['fundus-examination'],
		plausible: ['slit-lamp', 'visual-fields']
	},
	'red-eye': {
		ideal: ['slit-lamp'],
		plausible: ['visual-acuity', 'tonometry']
	},
	'childhood-squint': {
		ideal: ['orthoptic-assessment', 'refraction'],
		plausible: ['visual-acuity']
	},
	'visual-field-defect': {
		ideal: ['visual-fields'],
		plausible: ['optical-coherence-tomography', 'fundus-examination']
	},
	'cataract-assessment': {
		ideal: ['visual-acuity', 'slit-lamp'],
		plausible: ['refraction', 'fundus-examination']
	},
	'headache-visual-symptoms': {
		ideal: ['visual-fields', 'fundus-examination'],
		plausible: ['visual-acuity', 'optical-coherence-tomography']
	},
	other: { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1-9) for an indication x testType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or test type has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: string,
	testType: string
): { score: number; band: AppropriatenessBand; firedRule: FiredRule } {
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
				description: `Requested ${testType} test is the recommended examination for "${indication}".`
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
				description: `Requested ${testType} test may be appropriate for "${indication}" but is not the first-line examination.`
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
			description: `Requested ${testType} test is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}
