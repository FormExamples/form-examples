import type {
	AppropriatenessBand,
	FiredRule,
	MatchFit,
	MonitorType,
	PrimaryIndication,
	SymptomFrequency
} from './types';

// ──────────────────────────────────────────────
// Axis A — Appropriateness (ACC/AHA ambulatory ECG 1–9 ordinal)
// ──────────────────────────────────────────────
//
// Each indication has an ideal monitor type (or set of types). When the
// requested monitor type matches the indication well, the request scores high
// (7–9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4–6 may-be-appropriate band; clearly mismatched pairings score 1–3. The raw
// indication-fit score is then adjusted by the symptom-frequency /
// monitor-duration match (Axis A.2 below).

/** Map of indication → ideal / plausible monitor types. */
const INDICATION_MONITOR_MAP: Record<string, { ideal: MonitorType[]; plausible: MonitorType[] }> = {
	palpitations: { ideal: ['24-hour', '48-hour', '7-day'], plausible: ['14-day', 'event-recorder'] },
	'suspected-arrhythmia': {
		ideal: ['24-hour', '48-hour', '7-day'],
		plausible: ['14-day', 'event-recorder', 'implantable-loop-recorder']
	},
	syncope: {
		ideal: ['7-day', '14-day', 'implantable-loop-recorder'],
		plausible: ['48-hour', 'event-recorder', '24-hour']
	},
	'atrial-fibrillation-detection': {
		ideal: ['7-day', '14-day'],
		plausible: ['48-hour', '24-hour', 'event-recorder']
	},
	'post-stroke-af-screen': {
		ideal: ['7-day', '14-day', 'implantable-loop-recorder'],
		plausible: ['48-hour', '24-hour']
	},
	'rate-control-assessment': { ideal: ['24-hour', '48-hour'], plausible: ['7-day'] },
	'qt-monitoring': { ideal: ['24-hour', '48-hour'], plausible: ['7-day'] },
	'pacemaker-check': { ideal: ['24-hour', '48-hour'], plausible: ['7-day'] },
	other: { ideal: [], plausible: [] }
};

/**
 * Score the raw indication × monitorType appropriateness (1–9) and return the
 * fired rule. Defaults to a neutral may-be-appropriate when the indication or
 * monitor type has not yet been chosen.
 */
export function scoreAppropriateness(
	indication: PrimaryIndication,
	monitorType: MonitorType
): { score: number; band: AppropriatenessBand; firedRule: FiredRule } {
	if (!indication || !monitorType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description:
					'Indication or monitor type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_MONITOR_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(monitorType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${monitorType} monitor is a recommended choice for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(monitorType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${monitorType} monitor may be appropriate for "${indication}" but is not the first-line choice.`
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
			description: `Requested ${monitorType} monitor is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

// ──────────────────────────────────────────────
// Axis A.2 — Symptom-frequency / monitor-duration match
// ──────────────────────────────────────────────
//
// The diagnostic yield of a short Holter is high only for frequent symptoms;
// infrequent symptoms need longer or patient-activated recording. The match
// either reinforces or downgrades the raw appropriateness score and feeds the
// symptom-frequency / monitor-mismatch safety flag.

const FREQUENCY_MONITOR_MAP: Record<
	string,
	{ matched: MonitorType[]; borderline: MonitorType[] }
> = {
	daily: { matched: ['24-hour', '48-hour'], borderline: ['7-day'] },
	weekly: { matched: ['7-day'], borderline: ['48-hour', '14-day'] },
	monthly: {
		matched: ['14-day', 'event-recorder'],
		borderline: ['7-day', 'implantable-loop-recorder']
	},
	rare: { matched: ['event-recorder', 'implantable-loop-recorder'], borderline: ['14-day'] }
};

/** Recommended monitor copy per frequency, for mismatch messaging. */
const FREQUENCY_RECOMMENDED_LABEL: Record<string, string> = {
	daily: '24-hour or 48-hour Holter',
	weekly: '7-day monitor',
	monthly: '14-day monitor or event recorder',
	rare: 'event recorder or implantable loop recorder'
};

/**
 * Evaluate the symptom-frequency / monitor-duration match. `fit` is one of
 * '' | 'matched' | 'borderline' | 'mismatched'.
 */
export function evaluateFrequencyMatch(
	symptomFrequency: SymptomFrequency,
	monitorType: MonitorType
): { fit: MatchFit; recommendedMonitor: string; firedRule: FiredRule | null } {
	if (!symptomFrequency || !monitorType) {
		return {
			fit: '',
			recommendedMonitor: '',
			firedRule: {
				ruleId: 'R-MATCH-UNKNOWN',
				axis: 'appropriateness',
				category: symptomFrequency || 'unspecified',
				description:
					'Symptom frequency or monitor type not yet specified — match not assessed.'
			}
		};
	}

	const map = FREQUENCY_MONITOR_MAP[symptomFrequency];
	const recommendedMonitor = FREQUENCY_RECOMMENDED_LABEL[symptomFrequency] ?? '';
	const freqKey = symptomFrequency.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (!map) {
		return { fit: '', recommendedMonitor: '', firedRule: null };
	}

	if (map.matched.includes(monitorType)) {
		return {
			fit: 'matched',
			recommendedMonitor: '',
			firedRule: {
				ruleId: `R-MATCH-${freqKey}-MATCHED`,
				axis: 'appropriateness',
				category: 'symptom-frequency',
				description: `${monitorType} monitor matches ${symptomFrequency} symptoms.`
			}
		};
	}
	if (map.borderline.includes(monitorType)) {
		return {
			fit: 'borderline',
			recommendedMonitor,
			firedRule: {
				ruleId: `R-MATCH-${freqKey}-BORDERLINE`,
				axis: 'appropriateness',
				category: 'symptom-frequency',
				description: `${monitorType} monitor is a borderline fit for ${symptomFrequency} symptoms; ${recommendedMonitor} preferred.`
			}
		};
	}
	return {
		fit: 'mismatched',
		recommendedMonitor,
		firedRule: {
			ruleId: `R-MATCH-${freqKey}-MISMATCH`,
			axis: 'appropriateness',
			category: 'symptom-frequency',
			description: `${monitorType} monitor is a poor fit for ${symptomFrequency} symptoms; ${recommendedMonitor} recommended.`
		}
	};
}

/**
 * Combine the raw appropriateness score with the frequency-match fit, clamped
 * to 1–9. A mismatch downgrades; a match nudges up.
 */
export function adjustAppropriatenessForMatch(rawScore: number, matchFit: MatchFit): number {
	let score = rawScore;
	if (matchFit === 'matched') score += 1;
	else if (matchFit === 'borderline') score -= 1;
	else if (matchFit === 'mismatched') score -= 3;
	return Math.max(1, Math.min(9, score));
}
