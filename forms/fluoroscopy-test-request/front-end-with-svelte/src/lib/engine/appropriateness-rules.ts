import type { FluoroscopyRequest, AppropriatenessBand, FiredRule } from './types';

/**
 * Axis A — appropriateness (ACR Appropriateness Criteria / RCR iRefer 1–9).
 *
 * Each indication has an ideal study type (or set of types). When the requested
 * study type matches the indication well, the request scores high (7–9,
 * usually-appropriate). Plausible-but-suboptimal pairings score 4–6
 * (may-be-appropriate); clearly mismatched pairings score 1–3.
 *
 * Rule IDs are stable and identical across every front-end and the back-end.
 */

/** Map of indication → { ideal:[studyType], plausible:[studyType] }. */
const INDICATION_STUDY_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	dysphagia: { ideal: ['barium-swallow', 'water-soluble-contrast-swallow'], plausible: ['barium-meal'] },
	reflux: { ideal: ['barium-meal', 'barium-swallow'], plausible: ['water-soluble-contrast-swallow'] },
	'suspected-obstruction': {
		ideal: ['barium-follow-through', 'water-soluble-contrast-swallow'],
		plausible: ['barium-meal', 'barium-enema']
	},
	'suspected-perforation': { ideal: ['water-soluble-contrast-swallow'], plausible: [] },
	constipation: { ideal: ['defecating-proctogram', 'barium-enema'], plausible: ['barium-follow-through'] },
	'infertility-tubal-patency': { ideal: ['hysterosalpingogram'], plausible: [] },
	'vesicoureteric-reflux': { ideal: ['micturating-cystourethrogram'], plausible: [] },
	'joint-assessment': { ideal: ['arthrogram'], plausible: ['fluoroscopy-guided-procedure'] },
	other: { ideal: [], plausible: [] }
};

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1–9) for an indication × studyType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or study type has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: string,
	studyType: string
): { score: number; band: AppropriatenessBand; firedRule: FiredRule | null } {
	if (!indication || !studyType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or study type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_STUDY_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(studyType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${studyType} study is the recommended examination for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(studyType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${studyType} study may be appropriate for "${indication}" but is not the first-line examination.`
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
			description: `Requested ${studyType} study is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}
