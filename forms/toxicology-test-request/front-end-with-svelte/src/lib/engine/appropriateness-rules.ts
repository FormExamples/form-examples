import type { ToxicologyRequest, AppropriatenessBand, AssayField, FiredRule } from './types';
import { selectedAssayFields } from './utils';

/**
 * Axis A — appropriateness (TOXBASE / NPIS indication-to-assay match, 1–9).
 *
 * Each indication has ideal assays (the first-line assays for that context) and
 * plausible assays (reasonable but not first-line). A request that selects at
 * least one ideal assay scores high (7–9, usually-appropriate); a request that
 * selects only plausible assays scores in the 4–6 may-be-appropriate band; a
 * request with assays selected but none matching scores 1–3. A request with no
 * assay at all scores the floor (1) and is usually-not-appropriate.
 *
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
const INDICATION_ASSAY_MAP: Record<string, { ideal: AssayField[]; plausible: AssayField[] }> = {
	'suspected-overdose': {
		ideal: ['paracetamolLevel', 'salicylateLevel'],
		plausible: ['drugsOfAbuseScreen', 'specificDrugLevel', 'alcoholLevel']
	},
	'deliberate-self-harm': {
		ideal: ['paracetamolLevel', 'salicylateLevel'],
		plausible: ['drugsOfAbuseScreen', 'specificDrugLevel', 'alcoholLevel']
	},
	'therapeutic-drug-monitoring': {
		ideal: ['lithiumLevel', 'digoxinLevel', 'antiepilepticDrugLevel'],
		plausible: ['specificDrugLevel']
	},
	'suspected-poisoning': {
		ideal: ['carboxyhaemoglobin', 'heavyMetals', 'specificDrugLevel'],
		plausible: ['paracetamolLevel', 'salicylateLevel', 'drugsOfAbuseScreen']
	},
	'substance-misuse-screen': {
		ideal: ['drugsOfAbuseScreen'],
		plausible: ['alcoholLevel', 'specificDrugLevel']
	},
	'occupational-screen': {
		ideal: ['heavyMetals', 'drugsOfAbuseScreen'],
		plausible: ['carboxyhaemoglobin', 'specificDrugLevel']
	},
	forensic: {
		ideal: ['alcoholLevel', 'drugsOfAbuseScreen'],
		plausible: ['specificDrugLevel']
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
 * Score appropriateness (1–9) for an indication × selected-assays pairing and
 * return the fired rule. A request with no assay selected scores the floor.
 */
export function scoreAppropriateness(r: ToxicologyRequest): {
	score: number;
	band: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const indication = r.clinical.primaryIndication;
	const selected = selectedAssayFields(r);

	if (selected.length === 0) {
		return {
			score: 1,
			band: 'usually-not-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-NO-TEST',
					axis: 'appropriateness',
					category: 'no-test-selected',
					description:
						'No assay selected — request cannot be actioned until at least one assay is chosen.'
				}
			]
		};
	}

	if (!indication) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: 'unspecified',
					description: 'Primary indication not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map = INDICATION_ASSAY_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');
	const hasIdeal = selected.some((f) => map.ideal.includes(f));
	const hasPlausible = selected.some((f) => map.plausible.includes(f));

	if (hasIdeal) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-IDEAL`,
					axis: 'appropriateness',
					category: indication,
					description: `Selected assays include a first-line assay for "${indication}".`
				}
			]
		};
	}
	if (hasPlausible) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
					axis: 'appropriateness',
					category: indication,
					description: `Selected assays may be appropriate for "${indication}" but are not the first-line assays.`
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
					description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
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
				description: `Selected assays are not usually appropriate for "${indication}"; query the referrer.`
			}
		]
	};
}
