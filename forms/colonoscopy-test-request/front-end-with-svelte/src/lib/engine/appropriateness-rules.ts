// ──────────────────────────────────────────────
// Axis A — Appropriateness (ASGE / EPAGE / NICE 1–9 ordinal)
//
// Each indication has an ideal procedure (or set of procedures). When the
// requested procedure matches the indication well, the request scores high
// (7–9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4–6 may-be-appropriate band; clearly mismatched pairings score 1–3.
// Rule IDs (R-APPROP-*) are stable and identical across every front-end and
// the back-end.
// ──────────────────────────────────────────────

import type { ColonoscopyRequest, AppropriatenessBand, FiredRule, Indication, Procedure } from './types';

/** Map of indication → ideal / plausible procedures. */
export const INDICATION_PROCEDURE_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'rectal-bleeding': { ideal: ['colonoscopy', 'flexible-sigmoidoscopy'], plausible: ['ct-colonography'] },
	'change-in-bowel-habit': { ideal: ['colonoscopy'], plausible: ['ct-colonography', 'flexible-sigmoidoscopy'] },
	'iron-deficiency-anaemia': { ideal: ['colonoscopy'], plausible: ['ct-colonography'] },
	'positive-fit': { ideal: ['colonoscopy'], plausible: ['ct-colonography'] },
	'abdominal-mass': { ideal: ['colonoscopy', 'ct-colonography'], plausible: ['flexible-sigmoidoscopy'] },
	'ibd-diagnosis': { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
	'ibd-surveillance': { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
	'polyp-surveillance': { ideal: ['colonoscopy'], plausible: ['ct-colonography'] },
	'crc-screening': { ideal: ['colonoscopy'], plausible: ['ct-colonography', 'flexible-sigmoidoscopy'] },
	'abnormal-imaging': { ideal: ['colonoscopy'], plausible: ['ct-colonography'] },
	'chronic-diarrhoea': { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
	other: { ideal: [], plausible: [] }
};

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1–9) for an indication × procedure pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or procedure has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: Indication,
	procedure: Procedure
): { score: number; band: AppropriatenessBand; firedRule: FiredRule | null } {
	if (!indication || !procedure) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or procedure not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_PROCEDURE_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(procedure)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${procedure} is the recommended examination for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(procedure)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${procedure} may be appropriate for "${indication}" but is not the first-line examination.`
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
			description: `Requested ${procedure} is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}
