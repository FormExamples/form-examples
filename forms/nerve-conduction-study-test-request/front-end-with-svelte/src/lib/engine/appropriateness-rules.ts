import type { NerveConductionStudyRequest, AppropriatenessBand, FiredRule } from './types';

/**
 * Axis A — Appropriateness (AANEM / AAN electrodiagnostic, 1–9 ordinal).
 *
 * Each indication has an ideal study type (or set of types). When the requested
 * study type matches the indication well, the request scores high
 * (7–9, usually-appropriate). Plausible-but-suboptimal pairings score in the
 * 4–6 may-be-appropriate band; clearly mismatched pairings score 1–3. Rule IDs
 * are stable and identical across every front-end and the back-end.
 */

/** Map of indication → { ideal:[studyType], plausible:[studyType] }. */
const INDICATION_STUDY_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'carpal-tunnel': { ideal: ['nerve-conduction', 'nerve-conduction-and-emg'], plausible: ['emg'] },
	'peripheral-neuropathy': {
		ideal: ['nerve-conduction-and-emg', 'nerve-conduction'],
		plausible: ['emg']
	},
	radiculopathy: { ideal: ['emg', 'nerve-conduction-and-emg'], plausible: ['nerve-conduction'] },
	'suspected-motor-neurone-disease': {
		ideal: ['nerve-conduction-and-emg', 'emg'],
		plausible: ['nerve-conduction']
	},
	myopathy: { ideal: ['emg'], plausible: ['nerve-conduction-and-emg'] },
	plexopathy: { ideal: ['nerve-conduction-and-emg', 'emg'], plausible: ['nerve-conduction'] },
	'suspected-myasthenia': {
		ideal: ['repetitive-stimulation'],
		plausible: ['nerve-conduction', 'nerve-conduction-and-emg']
	},
	'nerve-injury': { ideal: ['nerve-conduction-and-emg', 'nerve-conduction'], plausible: ['emg'] },
	other: { ideal: [], plausible: [] }
};

/**
 * Score appropriateness (1–9) for an indication × studyType pairing and return
 * the band plus the fired rule. Defaults to a neutral may-be-appropriate when
 * the indication or study type has not yet been chosen.
 */
export function gradeAppropriateness(r: NerveConductionStudyRequest): {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const indication = r.request.primaryIndication;
	const studyType = r.study.studyType;

	if (!indication || !studyType) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: indication || 'unspecified',
					description:
						'Indication or study type not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map = INDICATION_STUDY_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(studyType)) {
		return {
			appropriatenessScore: 8,
			appropriatenessBand: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-IDEAL`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${studyType} study is the recommended examination for "${indication}".`
				}
			]
		};
	}
	if (map.plausible.includes(studyType)) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${studyType} study may be appropriate for "${indication}" but is not the first-line examination.`
				}
			]
		};
	}
	if (indication === 'other') {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
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
		appropriatenessScore: 2,
		appropriatenessBand: 'usually-not-appropriate',
		firedRules: [
			{
				ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${studyType} study is not usually appropriate for "${indication}"; query the referrer.`
			}
		]
	};
}
