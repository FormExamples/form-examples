// ──────────────────────────────────────────────
// Axis A — Appropriateness (marker-to-indication fit, 1-9 ordinal)
//
// Each marker has a set of indications for which it is established (NICE / ACB
// / RCPath). When every selected marker matches the recorded indication well,
// the request scores high (7-9, usually-appropriate). When at least one marker
// does not match the indication it drops into may-be-appropriate (4-6) or, for
// clear screening misuse, usually-not-appropriate (1-3). Ported verbatim from
// the HTML front-end's js/rules.js; rule IDs are stable across every front-end.
// ──────────────────────────────────────────────

import type { AppropriatenessBand, FiredRule, Indication, MarkerField, Markers } from './types';
import { markerLabel, selectedMarkerFields } from './markers';

/** Map of marker field → indications for which the marker is appropriate. */
export const MARKER_INDICATION_MAP: Record<MarkerField, Indication[]> = {
	psa: ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'screening-high-risk'],
	ca125: ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'characterise-mass'],
	ca19_9: ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'characterise-mass'],
	carcinoembryonicAntigenCea: ['cancer-monitoring', 'treatment-response', 'recurrence-surveillance'],
	alphaFetoproteinAfp: ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'characterise-mass', 'screening-high-risk'],
	betaHcg: ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance'],
	ca15_3: ['cancer-monitoring', 'treatment-response', 'recurrence-surveillance'],
	lactateDehydrogenaseLdh: ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance'],
	calcitonin: ['suspected-malignancy', 'cancer-monitoring', 'recurrence-surveillance', 'screening-high-risk'],
	chromograninA: ['suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'characterise-mass']
};

/**
 * Indications that represent broad / non-evidence-based screening when applied
 * to markers with poor screening performance.
 */
export const SCREENING_MISUSE_INDICATIONS: Indication[] = ['screening-high-risk'];

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/** The result of scoring Axis A. */
export interface AppropriatenessResult {
	score: number;
	band: AppropriatenessBand;
	firedRules: FiredRule[];
	mismatchedMarkers: MarkerField[];
	screeningMisuse: boolean;
}

/**
 * Score appropriateness (1-9) for the selected markers against the recorded
 * indication and return all fired rules. Returns a neutral provisional band
 * when nothing has been selected yet.
 */
export function scoreAppropriateness(
	markers: Markers,
	indication: Indication
): AppropriatenessResult {
	const selected = selectedMarkerFields(markers);
	const firedRules: FiredRule[] = [];

	if (selected.length === 0) {
		return {
			score: 1,
			band: 'usually-not-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-NO-MARKER-SELECTED',
					axis: 'appropriateness',
					category: 'no-marker-selected',
					description: 'No tumour marker has been selected; the request cannot be actioned.'
				}
			],
			mismatchedMarkers: [],
			screeningMisuse: false
		};
	}

	if (!indication) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-INDICATION-UNSPECIFIED',
					axis: 'appropriateness',
					category: 'unspecified',
					description: 'Primary indication not yet specified — provisional appropriateness.'
				}
			],
			mismatchedMarkers: [],
			screeningMisuse: false
		};
	}

	const isScreeningMisuse = SCREENING_MISUSE_INDICATIONS.includes(indication);
	const mismatchedMarkers: MarkerField[] = [];

	for (const field of selected) {
		const allowed = MARKER_INDICATION_MAP[field] || [];
		const markerKey = field.toUpperCase().replace(/[^A-Z0-9]+/g, '-');
		if (indication === 'other') {
			// "Other" cannot be matched mechanically; flag for vetting.
			firedRules.push({
				ruleId: `R-APPROP-${markerKey}-OTHER`,
				axis: 'appropriateness',
				category: field,
				description: `Indication "other" recorded for ${markerLabel(field)}; appropriateness requires clinician vetting.`
			});
		} else if (!allowed.includes(indication)) {
			mismatchedMarkers.push(field);
			firedRules.push({
				ruleId: `R-APPROP-${markerKey}-MISMATCH`,
				axis: 'appropriateness',
				category: field,
				description: `${markerLabel(field)} is not an established marker for "${indication}".`
			});
		} else {
			firedRules.push({
				ruleId: `R-APPROP-${markerKey}-MATCH`,
				axis: 'appropriateness',
				category: field,
				description: `${markerLabel(field)} matches the recorded indication "${indication}".`
			});
		}
	}

	let score: number;
	let band: AppropriatenessBand;
	if (isScreeningMisuse) {
		score = 3;
		band = 'usually-not-appropriate';
		firedRules.push({
			ruleId: 'R-APPROP-SCREENING-MISUSE',
			axis: 'appropriateness',
			category: 'inappropriate-screening-use',
			description: 'Tumour markers requested as broad screening; markers are poor screening tests in unselected populations.'
		});
	} else if (mismatchedMarkers.length === 0) {
		score = indication === 'other' ? 5 : 8;
		band = appropriatenessBand(score);
	} else if (mismatchedMarkers.length < selected.length) {
		score = 5;
		band = 'may-be-appropriate';
	} else {
		score = 2;
		band = 'usually-not-appropriate';
	}

	return {
		score,
		band,
		firedRules,
		mismatchedMarkers,
		screeningMisuse: isScreeningMisuse
	};
}
