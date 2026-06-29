// ──────────────────────────────────────────────
// Axis A — Appropriateness (ACR Appropriateness Criteria 1–9 ordinal)
//
// Each indication has an ideal body region (or set). A well-matched request
// scores high (7–9, usually-appropriate); a plausible-but-suboptimal pairing
// scores 4–6 (may-be-appropriate); a clearly mismatched pairing scores 1–3.
// Rule IDs are stable and identical across every front-end and the back-end
// (R-APPROP-*). Ported verbatim from the source-of-truth HTML engine.
// ──────────────────────────────────────────────

import type { AppropriatenessBand, BodyRegion, FiredRule, Indication } from './types';

/** Map of indication → { ideal:[bodyRegion], plausible:[bodyRegion] }. */
const INDICATION_REGION_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	trauma: {
		ideal: ['head', 'spine', 'chest', 'abdomen-pelvis', 'whole-body', 'extremity'],
		plausible: ['neck', 'abdomen', 'pelvis', 'ct-angiogram']
	},
	'suspected-stroke': { ideal: ['head'], plausible: ['ct-angiogram', 'neck'] },
	'suspected-malignancy': {
		ideal: ['chest', 'abdomen-pelvis', 'neck', 'ct-colonography'],
		plausible: ['abdomen', 'pelvis', 'whole-body', 'head']
	},
	'cancer-staging': {
		ideal: ['chest', 'abdomen-pelvis', 'whole-body'],
		plausible: ['neck', 'abdomen', 'pelvis', 'head']
	},
	'pulmonary-embolism': { ideal: ['ct-angiogram', 'chest'], plausible: [] },
	'abdominal-pain': { ideal: ['abdomen-pelvis', 'abdomen'], plausible: ['pelvis', 'whole-body'] },
	'renal-colic': { ideal: ['abdomen-pelvis', 'abdomen'], plausible: ['pelvis'] },
	'infection-abscess': {
		ideal: ['abdomen-pelvis', 'chest', 'neck'],
		plausible: ['abdomen', 'pelvis', 'head']
	},
	'pre-surgical-planning': {
		ideal: ['abdomen-pelvis', 'spine', 'chest', 'extremity', 'ct-angiogram'],
		plausible: ['head', 'neck', 'abdomen', 'pelvis', 'whole-body']
	},
	'follow-up-surveillance': {
		ideal: ['chest', 'abdomen-pelvis', 'ct-colonography'],
		plausible: ['abdomen', 'pelvis', 'neck', 'whole-body', 'head']
	},
	headache: { ideal: ['head'], plausible: ['ct-angiogram', 'neck'] },
	other: { ideal: [], plausible: [] }
};

/** The result of grading Axis A. */
export interface AppropriatenessResult {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
}

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Grade appropriateness (1–9) for the indication × bodyRegion pairing. Defaults
 * to a neutral may-be-appropriate when the indication or region is not yet set.
 */
export function gradeAppropriateness(
	indication: Indication,
	bodyRegion: BodyRegion
): AppropriatenessResult {
	if (!indication || !bodyRegion) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: indication || 'unspecified',
					description:
						'Indication or body region not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map = INDICATION_REGION_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(bodyRegion)) {
		return {
			appropriatenessScore: 8,
			appropriatenessBand: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-IDEAL`,
					axis: 'appropriateness',
					category: indication,
					description: `CT ${bodyRegion} is the recommended examination for "${indication}".`
				}
			]
		};
	}
	if (map.plausible.includes(bodyRegion)) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
					axis: 'appropriateness',
					category: indication,
					description: `CT ${bodyRegion} may be appropriate for "${indication}" but is not the first-line examination.`
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
					description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
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
				description: `CT ${bodyRegion} is not usually appropriate for "${indication}"; query the referrer.`
			}
		]
	};
}
