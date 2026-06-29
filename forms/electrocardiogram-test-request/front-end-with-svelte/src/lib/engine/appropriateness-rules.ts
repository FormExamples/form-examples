import type { EcgRequest, AppropriatenessBand, EcgType, Indication, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis A — Appropriateness (AHA/ACC ECG-use guidance, 1–9 ordinal)
//
// Each indication has an ideal ECG type (or set of types). A good
// indication × ECG-type pairing scores high (7–9, usually-appropriate);
// plausible-but-suboptimal pairings score 4–6 (may-be-appropriate); clearly
// mismatched pairings score 1–3 (usually-not-appropriate). Rule IDs are stable
// and identical across every front-end and the back-end.
// ──────────────────────────────────────────────

/** Map of indication → ideal and plausible ECG types. */
export const INDICATION_ECG_MAP: Record<string, { ideal: EcgType[]; plausible: EcgType[] }> = {
	'chest-pain': { ideal: ['resting-12-lead'], plausible: ['exercise-stress'] },
	'suspected-mi-acs': { ideal: ['resting-12-lead'], plausible: [] },
	palpitations: {
		ideal: ['ambulatory-holter-24h', 'ambulatory-48h', 'event-recorder'],
		plausible: ['resting-12-lead']
	},
	'suspected-arrhythmia': {
		ideal: ['ambulatory-holter-24h', 'ambulatory-48h', 'event-recorder'],
		plausible: ['resting-12-lead']
	},
	syncope: {
		ideal: ['resting-12-lead', 'event-recorder'],
		plausible: ['ambulatory-holter-24h', 'ambulatory-48h']
	},
	'pre-operative': { ideal: ['resting-12-lead'], plausible: [] },
	'medication-monitoring-qt': { ideal: ['resting-12-lead'], plausible: [] },
	hypertension: { ideal: ['resting-12-lead'], plausible: [] },
	'heart-failure': { ideal: ['resting-12-lead'], plausible: ['ambulatory-holter-24h'] },
	screening: { ideal: ['resting-12-lead'], plausible: [] },
	'follow-up': {
		ideal: ['resting-12-lead'],
		plausible: ['ambulatory-holter-24h', 'ambulatory-48h', 'exercise-stress']
	},
	other: { ideal: [], plausible: [] }
};

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Axis A — score the appropriateness (1–9) of an indication × ECG-type pairing
 * and return the band plus the fired rule. Defaults to a neutral
 * may-be-appropriate when the indication or ECG type is not yet chosen.
 */
export function scoreAppropriateness(
	indication: Indication,
	ecgType: EcgType
): { score: number; band: AppropriatenessBand; firedRules: FiredRule[] } {
	if (!indication || !ecgType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: indication || 'unspecified',
					description:
						'Indication or ECG type not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map = INDICATION_ECG_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(ecgType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-IDEAL`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${ecgType} ECG is the recommended examination for "${indication}".`
				}
			]
		};
	}
	if (map.plausible.includes(ecgType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${ecgType} ECG may be appropriate for "${indication}" but is not the first-line examination.`
				}
			]
		};
	}
	if (indication === 'other') {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-OTHER',
					axis: 'appropriateness',
					category: 'other',
					description:
						'Indication recorded as "other"; appropriateness requires clinician vetting.'
				}
			]
		};
	}
	return {
		score: 2,
		band: 'usually-not-appropriate',
		firedRules: [
			{
				ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${ecgType} ECG is not usually appropriate for "${indication}"; query the referrer.`
			}
		]
	};
}
