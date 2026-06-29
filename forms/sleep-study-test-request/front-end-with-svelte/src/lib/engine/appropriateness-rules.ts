import type { SleepStudyRequest, AppropriatenessBand, FiredRule } from './types';
import { EPWORTH_ABNORMAL, STOP_BANG_HIGH_RISK } from './constants';

/**
 * Map of indication → recommended ("ideal") and acceptable ("plausible") study
 * types (NICE NG202 / SIGN). Anything not listed for an indication is treated
 * as a mismatch.
 */
const INDICATION_STUDY_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-osa': {
		ideal: ['home-sleep-apnoea-test', 'polysomnography'],
		plausible: ['overnight-oximetry']
	},
	snoring: {
		ideal: ['home-sleep-apnoea-test'],
		plausible: ['overnight-oximetry', 'polysomnography']
	},
	'daytime-sleepiness': {
		ideal: ['home-sleep-apnoea-test', 'polysomnography'],
		plausible: ['multiple-sleep-latency-test', 'overnight-oximetry']
	},
	'suspected-narcolepsy': {
		ideal: ['multiple-sleep-latency-test', 'polysomnography'],
		plausible: ['actigraphy']
	},
	insomnia: { ideal: ['actigraphy'], plausible: ['polysomnography'] },
	'restless-legs': { ideal: ['polysomnography'], plausible: ['actigraphy'] },
	'copd-overlap': {
		ideal: ['polysomnography', 'overnight-oximetry'],
		plausible: ['home-sleep-apnoea-test']
	},
	'pre-bariatric': {
		ideal: ['home-sleep-apnoea-test', 'polysomnography'],
		plausible: ['overnight-oximetry']
	},
	'driver-assessment': {
		ideal: ['home-sleep-apnoea-test', 'polysomnography'],
		plausible: ['overnight-oximetry']
	},
	other: { ideal: [], plausible: [] }
};

/** Indications whose pathway is OSA-centric and expects Epworth / STOP-BANG. */
const OSA_PATHWAY_INDICATIONS = [
	'suspected-osa',
	'snoring',
	'daytime-sleepiness',
	'copd-overlap',
	'pre-bariatric',
	'driver-assessment'
];

/** Clamp a raw score to the 1–9 appropriateness range. */
function clampScore(n: number): number {
	return Math.max(1, Math.min(9, n));
}

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBandFor(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Axis A — appropriateness (NICE NG202 / SIGN, 1–9 ordinal).
 *
 * Scores the indication × study-type pairing, adjusted up or down on the OSA
 * pathway by the presence and severity of Epworth / STOP-BANG. Returns the
 * score, its band, and the fired audit-trail rules. Rule IDs are stable and
 * identical across every front-end and the back-end.
 */
export function gradeAppropriateness(r: SleepStudyRequest): {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const indication = r.request.primaryIndication;
	const studyType = r.request.studyType;
	const epworth = r.scores.epworthScore;
	const stopBang = r.scores.stopBangScore;

	if (!indication || !studyType) {
		firedRules.push({
			ruleId: 'R-APPROP-UNSPECIFIED',
			axis: 'appropriateness',
			category: indication || 'unspecified',
			description: 'Indication or study type not yet specified — provisional appropriateness.'
		});
		return { appropriatenessScore: 5, appropriatenessBand: 'may-be-appropriate', firedRules };
	}

	const map = INDICATION_STUDY_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');
	let score: number;

	if (map.ideal.includes(studyType)) {
		score = 8;
		firedRules.push({
			ruleId: `R-APPROP-${indicationKey}-IDEAL`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${studyType} study is the recommended investigation for "${indication}".`
		});
	} else if (map.plausible.includes(studyType)) {
		score = 5;
		firedRules.push({
			ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${studyType} study may be appropriate for "${indication}" but is not the first-line investigation.`
		});
	} else if (indication === 'other') {
		score = 5;
		firedRules.push({
			ruleId: 'R-APPROP-OTHER',
			axis: 'appropriateness',
			category: 'other',
			description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
		});
	} else {
		score = 2;
		firedRules.push({
			ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${studyType} study is not usually appropriate for "${indication}"; query the referrer.`
		});
	}

	// Epworth / STOP-BANG adjustment on the OSA pathway.
	if (OSA_PATHWAY_INDICATIONS.includes(indication)) {
		const hasEpworth = epworth !== null && epworth !== undefined;
		const hasStopBang = stopBang !== null && stopBang !== undefined;
		if (
			(hasEpworth && Number(epworth) >= EPWORTH_ABNORMAL) ||
			(hasStopBang && Number(stopBang) >= STOP_BANG_HIGH_RISK)
		) {
			score = clampScore(score + 1);
			firedRules.push({
				ruleId: 'R-APPROP-OSA-EVIDENCE',
				axis: 'appropriateness',
				category: indication,
				description: 'High Epworth and/or STOP-BANG supports the OSA-pathway request.'
			});
		} else if (!hasEpworth && !hasStopBang) {
			score = clampScore(score - 1);
			firedRules.push({
				ruleId: 'R-APPROP-OSA-NO-EVIDENCE',
				axis: 'appropriateness',
				category: indication,
				description: 'No Epworth or STOP-BANG recorded to support the OSA-pathway request.'
			});
		}
	}

	return { appropriatenessScore: score, appropriatenessBand: appropriatenessBandFor(score), firedRules };
}
