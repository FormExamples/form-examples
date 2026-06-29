import type { HistopathologyRequest, AppropriatenessBand, FiredRule } from './types';

/**
 * Axis A — appropriateness (RCPath cancer datasets / tissue pathways, 1–9).
 *
 * Each indication has an ideal specimen type (or set of types). When the
 * requested specimen type matches the indication well the request scores high
 * (7–9, usually-appropriate). Plausible-but-suboptimal pairings score in the
 * 4–6 may-be-appropriate band; clearly mismatched pairings score 1–3.
 *
 * Map of indication → { ideal:[specimenType], plausible:[specimenType] }.
 * Anything not listed for an indication is treated as a mismatch.
 */
export const INDICATION_SPECIMEN_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-malignancy': {
		ideal: ['biopsy', 'excision', 'endoscopic-biopsy', 'skin-lesion'],
		plausible: ['resection', 'frozen-section']
	},
	'cancer-staging': { ideal: ['resection', 'excision'], plausible: ['biopsy', 'frozen-section'] },
	'inflammatory-disease': {
		ideal: ['biopsy', 'endoscopic-biopsy'],
		plausible: ['excision', 'skin-lesion']
	},
	infection: { ideal: ['biopsy', 'endoscopic-biopsy'], plausible: ['excision', 'skin-lesion'] },
	'characterise-lesion': {
		ideal: ['biopsy', 'excision', 'skin-lesion'],
		plausible: ['endoscopic-biopsy', 'resection']
	},
	'margin-assessment': {
		ideal: ['excision', 'resection'],
		plausible: ['frozen-section', 'biopsy']
	},
	'transplant-monitoring': { ideal: ['biopsy'], plausible: ['endoscopic-biopsy'] },
	other: { ideal: [], plausible: [] }
};

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBandForScore(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1–9) for an indication × specimenType pairing and
 * return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or specimen type has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: string,
	specimenType: string
): { score: number; band: AppropriatenessBand; firedRule: FiredRule | null } {
	if (!indication || !specimenType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description:
					'Indication or specimen type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_SPECIMEN_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(specimenType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${specimenType} specimen is the recommended sample for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(specimenType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${specimenType} specimen may be appropriate for "${indication}" but is not the first-line sample.`
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
				description: 'Indication recorded as "other"; appropriateness requires pathologist vetting.'
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
			description: `Requested ${specimenType} specimen is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}
