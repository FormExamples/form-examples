import type { AppropriatenessBand, BodyRegion, FiredRule, Indication } from './types';

/**
 * Axis A — Appropriateness (ACR Appropriateness Criteria 1–9 ordinal).
 *
 * Each indication has an ideal body region (or set of regions). When the
 * requested region matches the indication well, the request scores high (7–9,
 * usually-appropriate). Plausible-but-suboptimal pairings score in the 4–6
 * may-be-appropriate band; clearly mismatched pairings score 1–3.
 */

/** Map of indication → { ideal:[bodyRegion], plausible:[bodyRegion] }. */
const INDICATION_REGION_MAP: Record<string, { ideal: BodyRegion[]; plausible: BodyRegion[] }> = {
	'abdominal-pain': { ideal: ['abdomen', 'liver-biliary', 'renal-tract'], plausible: ['pelvis'] },
	'suspected-gallstones': { ideal: ['liver-biliary', 'abdomen'], plausible: [] },
	'abnormal-lfts': { ideal: ['liver-biliary', 'abdomen'], plausible: [] },
	'renal-impairment': { ideal: ['renal-tract'], plausible: ['abdomen'] },
	haematuria: { ideal: ['renal-tract'], plausible: ['pelvis', 'abdomen'] },
	'palpable-mass': {
		ideal: ['soft-tissue', 'thyroid-neck', 'breast', 'abdomen', 'pelvis'],
		plausible: ['scrotum-testes', 'msk-joint']
	},
	'suspected-dvt': { ideal: ['dvt-leg'], plausible: ['vascular-doppler'] },
	'suspected-aaa': { ideal: ['abdomen', 'vascular-doppler'], plausible: [] },
	'thyroid-nodule': { ideal: ['thyroid-neck'], plausible: ['soft-tissue'] },
	'testicular-pain': { ideal: ['scrotum-testes'], plausible: [] },
	'follow-up': {
		ideal: [
			'abdomen',
			'liver-biliary',
			'renal-tract',
			'pelvis',
			'thyroid-neck',
			'scrotum-testes',
			'breast',
			'soft-tissue',
			'vascular-doppler',
			'carotid',
			'msk-joint'
		],
		plausible: []
	},
	other: { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1–9) for an indication × bodyRegion pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or body region has not yet been chosen. Rule IDs are stable and identical
 * across every front-end and the back-end.
 */
export function scoreAppropriateness(
	indication: Indication,
	bodyRegion: BodyRegion
): { score: number; band: AppropriatenessBand; firedRule: FiredRule } {
	if (!indication || !bodyRegion) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or body region not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_REGION_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(bodyRegion)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${bodyRegion} ultrasound is the recommended examination for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(bodyRegion)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${bodyRegion} ultrasound may be appropriate for "${indication}" but is not the first-line examination.`
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
			description: `Requested ${bodyRegion} ultrasound is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBandFromScore(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}
