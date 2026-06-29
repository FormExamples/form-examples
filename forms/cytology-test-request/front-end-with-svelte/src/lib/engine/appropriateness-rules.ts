import type { CytologyRequest, AppropriatenessBand, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis A — Appropriateness (NHS Cervical Screening / indication match, 1–9)
//
// Each indication has an ideal specimen type (or set of types). When the
// requested specimen type matches the indication well, the request scores high
// (7–9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4–6 may-be-appropriate band; clearly mismatched pairings score 1–3. Rule IDs
// are stable and identical across every front-end and the back-end.
// ──────────────────────────────────────────────

/** Map of indication → ideal / plausible specimen types. */
export const INDICATION_SPECIMEN_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'cervical-screening': { ideal: ['cervical-smear'], plausible: [] },
	'suspected-malignancy': {
		ideal: [
			'urine-cytology',
			'sputum-cytology',
			'fluid-pleural-ascitic',
			'fine-needle-aspiration-thyroid',
			'fine-needle-aspiration-breast',
			'csf-cytology'
		],
		plausible: ['cervical-smear', 'other']
	},
	haematuria: { ideal: ['urine-cytology'], plausible: ['other'] },
	'effusion-investigation': { ideal: ['fluid-pleural-ascitic'], plausible: ['other'] },
	'thyroid-nodule': { ideal: ['fine-needle-aspiration-thyroid'], plausible: ['other'] },
	'breast-lump': { ideal: ['fine-needle-aspiration-breast'], plausible: ['other'] },
	'follow-up': {
		ideal: [
			'cervical-smear',
			'urine-cytology',
			'sputum-cytology',
			'fluid-pleural-ascitic',
			'fine-needle-aspiration-thyroid',
			'fine-needle-aspiration-breast',
			'csf-cytology'
		],
		plausible: ['other']
	},
	other: { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1–9) for an indication × specimenType pairing and
 * return the band plus the rule that fired. Defaults to a neutral
 * may-be-appropriate when the indication or specimen type is not yet chosen.
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
				description: `Requested ${specimenType} specimen is the recommended examination for "${indication}".`
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
				description: `Requested ${specimenType} specimen may be appropriate for "${indication}" but is not the first-line examination.`
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
			description: `Requested ${specimenType} specimen is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}
