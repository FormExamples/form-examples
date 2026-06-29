import type { XRayRequest, AppropriatenessBand, FiredRule } from './types';

/**
 * Axis A — Appropriateness (ACR Appropriateness Criteria / RCR iRefer 1-9).
 *
 * Each body region has a set of ideal indications (the requests a plain film is
 * first-line for) and plausible-but-suboptimal indications. A good pairing
 * scores high (7-9, usually-appropriate); a plausible one scores 4-6
 * (may-be-appropriate); a clear mismatch scores 1-3 (usually-not-appropriate).
 *
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export const REGION_INDICATION_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	chest: {
		ideal: ['chest-infection', 'suspected-pneumothorax', 'line-position-check', 'pre-operative'],
		plausible: ['foreign-body', 'follow-up']
	},
	abdomen: { ideal: ['abdominal-obstruction', 'swallowed-object', 'foreign-body'], plausible: ['follow-up'] },
	'spine-cervical': { ideal: ['trauma-fracture', 'arthritis'], plausible: ['joint-pain', 'follow-up'] },
	'spine-thoracic': { ideal: ['trauma-fracture', 'arthritis'], plausible: ['joint-pain', 'follow-up'] },
	'spine-lumbar': { ideal: ['trauma-fracture', 'arthritis'], plausible: ['joint-pain', 'follow-up'] },
	pelvis: { ideal: ['trauma-fracture', 'joint-pain', 'arthritis'], plausible: ['pre-operative', 'follow-up'] },
	hip: { ideal: ['trauma-fracture', 'joint-pain', 'arthritis'], plausible: ['pre-operative', 'follow-up'] },
	knee: { ideal: ['trauma-fracture', 'joint-pain'], plausible: ['arthritis', 'foreign-body', 'follow-up'] },
	'ankle-foot': { ideal: ['trauma-fracture', 'joint-pain', 'foreign-body'], plausible: ['arthritis', 'follow-up'] },
	shoulder: { ideal: ['trauma-fracture', 'joint-pain'], plausible: ['arthritis', 'follow-up'] },
	'wrist-hand': { ideal: ['trauma-fracture', 'joint-pain', 'foreign-body'], plausible: ['arthritis', 'follow-up'] },
	skull: { ideal: ['trauma-fracture', 'foreign-body'], plausible: ['follow-up'] },
	dental: { ideal: ['arthritis', 'foreign-body', 'follow-up'], plausible: ['trauma-fracture'] },
	other: { ideal: [], plausible: [] }
};

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1-9) for a region × indication pairing and return the
 * fired rule. Defaults to a neutral may-be-appropriate when the region or
 * indication has not yet been chosen.
 */
export function scoreAppropriateness(
	bodyRegion: string,
	indication: string
): { score: number; band: AppropriatenessBand; firedRule: FiredRule } {
	if (!bodyRegion || !indication) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: bodyRegion || 'unspecified',
				description: 'Body region or indication not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = REGION_INDICATION_MAP[bodyRegion] ?? { ideal: [], plausible: [] };
	const regionKey = bodyRegion.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(indication)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${regionKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Plain ${bodyRegion} radiograph is first-line for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(indication)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${regionKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Plain ${bodyRegion} radiograph may be appropriate for "${indication}" but is not first-line.`
			}
		};
	}
	if (bodyRegion === 'other' || indication === 'other') {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-OTHER',
				axis: 'appropriateness',
				category: 'other',
				description: 'Region or indication recorded as "other"; appropriateness requires clinician vetting.'
			}
		};
	}
	return {
		score: 2,
		band: 'usually-not-appropriate',
		firedRule: {
			ruleId: `R-APPROP-${regionKey}-MISMATCH`,
			axis: 'appropriateness',
			category: indication,
			description: `Plain ${bodyRegion} radiograph is not usually appropriate for "${indication}"; query the referrer or consider another modality.`
		}
	};
}
