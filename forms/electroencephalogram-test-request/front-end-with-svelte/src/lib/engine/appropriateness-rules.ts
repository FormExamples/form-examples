import type { AppropriatenessBand, FiredRule, EegType, Indication } from './types';

/**
 * Axis A — appropriateness (NICE NG217 / ILAE, 1–9 ordinal).
 *
 * Each indication has an ideal EEG type (or set of types). When the requested
 * EEG type matches the indication well the request scores high (7–9,
 * usually-appropriate). Plausible-but-suboptimal pairings score in the 4–6
 * may-be-appropriate band; clearly mismatched pairings score 1–3.
 */
const INDICATION_EEG_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-epilepsy': { ideal: ['routine-awake'], plausible: ['sleep-deprived'] },
	'seizure-classification': {
		ideal: ['routine-awake', 'sleep-deprived'],
		plausible: ['video-telemetry', 'ambulatory-24h']
	},
	'status-epilepticus': { ideal: ['routine-awake'], plausible: ['video-telemetry'] },
	encephalopathy: { ideal: ['routine-awake'], plausible: ['video-telemetry'] },
	'first-seizure': { ideal: ['routine-awake'], plausible: ['sleep-deprived'] },
	'funny-turns': {
		ideal: ['ambulatory-24h', 'video-telemetry'],
		plausible: ['routine-awake', 'sleep-deprived']
	},
	dementia: { ideal: ['routine-awake'], plausible: ['ambulatory-24h'] },
	'pre-surgical-evaluation': { ideal: ['video-telemetry'], plausible: ['ambulatory-24h'] },
	'medication-review': { ideal: ['routine-awake', 'ambulatory-24h'], plausible: ['sleep-deprived'] },
	other: { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1–9) for an indication × eegType pairing and return
 * the fired rule. Defaults to a neutral may-be-appropriate when the indication
 * or EEG type has not yet been chosen. Rule IDs are stable and identical across
 * every front-end and the back-end.
 */
export function scoreAppropriateness(
	indication: Indication,
	eegType: EegType
): { score: number; band: AppropriatenessBand; firedRule: FiredRule | null } {
	if (!indication || !eegType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description: 'Indication or EEG type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_EEG_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(eegType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${eegType} EEG is the recommended study for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(eegType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${eegType} EEG may be appropriate for "${indication}" but is not the first-line study.`
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
			description: `Requested ${eegType} EEG is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}
